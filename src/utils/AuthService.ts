import { refreshApi } from './api';

interface Session {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: number;
}

export class AuthService {
  private static instance: AuthService;
  private _session: Session | null = null;

  private constructor() {
    console.log('initializing AuthService');
    this.session = JSON.parse(localStorage.getItem('session') || 'null');

    if (this.session) {
      if (
        new Date() >
        new Date((+this.session.created_at + this.session.expires_in) * 1000)
      ) {
        refreshApi(this.session.refresh_token).then(({ data }) => {
          this.session = data;
        });
      }
    }
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }

    return AuthService.instance;
  }

  get session(): Session | null {
    return this._session;
  }

  set session(session: Session | null) {
    const sessionStr = JSON.stringify(session);
    localStorage.setItem('session', sessionStr);
    this._session = session;
  }

  isLoggedIn() {
    return !!this.session;
  }
}
