import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';

/*
  Generated class for the UserServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
export const enum UserType {
  QUESTIONER = 'Questioner',
  INFLUENCER = 'Influencer',
}

export interface Credential {
  email: string;
  password: string;
}

export interface Question {
  id: string;
  question: string;
  value: string;
  influencer: Influencer;
  questioner: Questioner;
}

export interface User {
  id: string;
  fullName: string;
  userName: string;
  email: string;
  role: UserType;
}

export interface Questioner extends User {
  following: Array<Influencer>;
  questions: Array<Question>;
}

export interface Influencer extends User {
  followers: Array<Questioner>;
  questions: Array<Question>;
  accessCode: string;
}

export interface Form extends User {
  password: string;
  confirmPassword: string;
  accessCode?: string;
}

@Injectable()
export class UserProvider {

  constructor(public http: Http, public apollo: Angular2Apollo) {
    console.log('Hello UserServiceProvider Provider');
  }

  async validateForm(form: Form): Promise<boolean> {
    const { fullName, userName, email, password, confirmPassword, role } = form;

    if(!fullName || !userName || !email || !password || !confirmPassword) {
      throw Error('There is some information missing. Try again.');
    }
    if(password != confirmPassword) {
      throw Error('Your passwords do not match. Please try again.');
    }
    if(role === UserType.INFLUENCER) {
      if(!form.accessCode) {
        throw Error('There is some information missing. Try again.');
      }
      if(!await this.getAccessCode(form.accessCode)) {
        throw Error('The Access Code is invalid!');
      }
    }
    if(await this.getUserByUserName(userName)) {
      throw Error('Username already exist.');
    } else if(await this.getUserByEmail(email)) {
      throw Error('Email already exist.');
    }

    return true;

  }

  getAccessCode(accessCode: string): Promise<{ id: string; }> {
    return this.apollo.query({
      query: gql`
        query AccessCode($accessCode: String!) {
          AccessCode(accessCode: $accessCode) {
            id
          }
        }
      `,
      variables: { accessCode },
    }).map(a => a.data['AccessCode']).toPromise();
  }

  getUserByUserName(userName: string): Promise<User> | Promise<boolean> {
    return this.apollo.query({
      query: gql`
        query User($userName: String!){
          User(userName: $userName) {
            id,
            userName,
            fullName,
            email,
            role,
          }
        }
      `,
      variables: { userName },
    }).map(u => u.data['User']).toPromise();
  }

  getUserByEmail(email: string): Promise<User> {
   return this.apollo.query({
      query: gql`
        query User($email: String!){
          User(email: $email) {
            id,
            userName,
            fullName,
            email,
            role,
          }
        }
      `,
      variables: { email },
    }).map(u => u.data['User']).toPromise();
  }

  createUser(form: Form): Promise<object> {
    if(form.role === UserType.INFLUENCER) {
      return this.getAccessCode(form.accessCode).then(accessCode => {
        return this.apollo.mutate({
          mutation: gql`
            mutation createUser(
              $email: String!,
              $password: String!,
              $fullName: String!,
              $userName: String!,
              $profilePic: String,
              $accessCode: String!,
              $role: USER_TYPE,
              $accessCodeId: ID!,
            ) {
              accessCode: deleteAccessCode(id: $accessCodeId) {
                id,
              }

              user: createUser(
                authProvider: {
                  email: { email: $email, password: $password }
                },
                role: $role,
                fullName: $fullName,
                userName: $userName,
                profilePic: $profilePic,
                influencer: {
                  accessCode: $accessCode,
                }
              ) {
                id,
              }
            }
          `,
          variables: { ...form, accessCodeId: accessCode.id },
        }).toPromise();
      });

    }
    return this.apollo.mutate({
      mutation: gql`
      mutation createUser(
        $email: String!,
        $password: String!,
        $fullName: String!,
        $userName: String!,
        $profilePic: String
      ) {
          createUser(
            authProvider: {
              email: { email: $email, password: $password }
            },
            fullName: $fullName,
            userName: $userName,
            profilePic: $profilePic,
            questioner: {},
          ) {
              id
            }
      }
      `,
      variables: { ...form },
    }).toPromise();
  }

  signIn(credential: { email: string, password: string }) {
      return this.apollo.mutate({
        mutation: gql`
        mutation signinUser($email: String!,$password: String!) {
          signinUser(email: {email: $email, password: $password}) {
            token
          }
        }
        `,
        variables: { ...credential },
      }).toPromise();
  }

}
