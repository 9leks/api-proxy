export const string = {
    ERROR_UNAUTHORIZED: 'Unauthorized. Please go to /login or /signup and include your authorization token.',
    ERROR_MISSING_USERNAME_PASSWORD: 'Please include both username and password in the body.\n',
    ERROR_USER_NOT_FOUND: 'User not found. Please go to /signup.\n',
    ERROR_INCORRECT_PASSWORD: 'The provided password was incorrect.\n',
    ERROR_NAME_TAKEN: 'Username taken. Please select another username.\n',
    ERROR_INCORRECT_GUESTBOOK_ENTRY: 'Could not delete guestbook entry. Ensure that you are the author.\n',
    LOGIN_SUCCESSFUL: 'You are now logged in for an hour. Use the provided bearer authorization for access.\n',
    SIGNUP_SUCCESSFUL: 'You have succesfully signed up. Go to /login to retrieve an authorization token.\n',
    GUESTBOOK_SUCCESSFUL_INSERTION: 'Inserted guestbook entry.\n',
    GUESTBOOK_SUCCESSFUL_DELETION: 'Entry deleted\n',
}

export const code = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
}

export const routes = {
    LOGIN: '/login',
    SIGNUP: '/signup',
    FACT: '/fact',
    GUESTBOOK: '/guestbook',
}

export const constants = {
    USERNAME: 'username',
    TOKEN: 'token',
}
