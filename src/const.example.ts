const crptTokenKey = 'crptToken';
const CORSProxy = ''; //https://your-proxy.ru

const enum UpdateType {
  INIT = 'INIT',
  PATCH = 'PATCH',
  MINOR = 'MINOR',
  MAJOR = 'MAJOR'
};

const enum CRPTEvent {
  DATA_INIT = 'DATA_INIT',
  DATA_INIT_ONE = 'DATA_INIT_ONE',
  LOGIN_INFO = 'LOGIN_INFO',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_ERROR = 'LOGIN_ERROR',
  MARK_CHECK = 'MARK_CHECK'
};

const enum MarkCheck {
  OK = 'OK',
  NOT_FOUND = 'NOT_FOUND',
  ERROR = 'ERROR'
};

const enum AlertType {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  SUCCESS = 'success',
  DANGER = 'danger',
  WARNING = 'warning',
  INFO = 'info',
  LIGHT = 'light',
  DARK = 'dark'
}

export { crptTokenKey, CORSProxy, UpdateType, CRPTEvent, AlertType, MarkCheck }
