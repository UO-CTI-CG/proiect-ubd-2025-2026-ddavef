from fastapi import status


def test_register_and_login(client):
    register_payload = {
        "username": "newuser",
        "email": "newuser@example.com",
        "password": "pass1234",
    }
    resp = client.post("/users/register", json=register_payload)
    assert resp.status_code == status.HTTP_201_CREATED

    login_resp = client.post(
        "/users/login",
        data={"username": register_payload["email"], "password": register_payload["password"]},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert login_resp.status_code == status.HTTP_200_OK
    token = login_resp.json()["access_token"]
    assert token

    me_resp = client.get("/users/me", headers={"Authorization": f"Bearer {token}"})
    assert me_resp.status_code == status.HTTP_200_OK
    assert me_resp.json()["email"] == register_payload["email"]
