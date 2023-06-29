const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

export const fetchUserState = async () => {
    const response = await fetch("/api/authenticate", {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
    });
    if (response.status === 200) {
        const data = await response.json();
        console.log('User is authenticated.', data);
        return data;
    }

    if (response.status === 401) {
        console.log('User is not logged in.');
    } else if (!response.ok) {
        throw new Error(`Could not fetch user state: ${response.statusText}`);
    }

    return response.json();
};

export const signup = async (username, email, password) => {
    const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
        body: JSON.stringify({ user: { username, email, password } }),
        credentials: 'include'
    });
    if (!response.ok) {
        if (response.status === 422) {
            throw new Error("Username or email already exists");
        } else {
            throw new Error("Error: " + response.status);
        }
    }
    return response.json();
};

export const login = async (username, password) => {
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
    }
    return response.json();
};


export const apiLogout = async () => {
    const response = await fetch("/api/logout", {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
    });

    if (!response.ok) {
        throw new Error(`Logout failed: ${response.statusText}`);
    }

    return response;
};

export const fetchUserDataById = async (userId) => {
    const response = await fetch(`/api/users/${userId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRF-Token': token
        },
    });
    if (!response.ok) {
        throw new Error(`Could not fetch user data: ${response.statusText}`);
    }
    return response.json();
};
