/**
 * Update user access group based on provided parameters. Access levels should be defined for the access group
 *
 * @param {number} AccessGroupId - The ID of the access group to update (integer).
 * @param {string} loginId - The login ID for authentication.
 * @param {string} password - The password for authentication.
 * @param {string} AccessGroupName - The name of the access group to update.
 * @param {number} action - The action type (1 for add users, 2 for remove users from access, other for no action).
 * @param {Array<number>} users - An array of user IDs to be added or modified.
 * @param {string} [baseUrl="https://127.0.0.1"] - The base URL for API requests.
 */
async function updateUserAccessGroup(
  AccessGroupId,
  loginId,
  password,
  AccessGroupName,
  action,
  users,
  baseUrl = "https://127.0.0.1"
) {
  try {
    const loginHeaders = new Headers();
    loginHeaders.append("Content-Type", "application/json");
    const loginData = JSON.stringify({
      User: {
        login_id: loginId,
        password: password,
      },
    });
    const loginOptions = {
      method: "POST",
      headers: loginHeaders,
      body: loginData,
      redirect: "follow",
    };

    const loginResponse = await fetch(`${baseUrl}/api/login`, loginOptions);
    if (loginResponse.status !== 200) {
      throw new Error("Login response status is not 200");
    }
    const bsid = loginResponse.headers.get("bs-session-id");
    const loginResult = await loginResponse.text();
    console.log("bs-session-id:", bsid);
    console.log("result:", loginResult);

    const formattedUsers = users.map((userId) => ({ user_id: userId }));
    let payload = {
      AccessGroup: {
        name: AccessGroupName,
      },
    };

    if (action === 1) {
      payload.AccessGroup.new_users = formattedUsers;
    }
    else if(action === 2) {
      payload.AccessGroup.delete_users = formattedUsers;
    }

    const updateHeaders = new Headers();
    updateHeaders.append("Content-Type", "application/json");
    updateHeaders.append("bs-session-id", bsid);
    const updateData = JSON.stringify(payload);
    const updateOptions = {
      method: "PUT",
      headers: updateHeaders,
      body: updateData,
      redirect: "follow",
    };

    const updateResponse = await fetch(
      `${baseUrl}/api/access_groups/${AccessGroupId}`,
      updateOptions
    );
    const updateResult = await updateResponse.text();
    console.log(updateResult);
  } catch (error) {
    console.log("error", error);
  }
}
