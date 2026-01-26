def test_payu_hash_sample_v1_computation():
    from app.api.v1.payments import _compute_payu_request_hash

    key = "OpJrSH"
    txnid = "PW2509140748220017"
    amount_in_inr = "500.00"
    productinfo = "Booking PW2509140030"
    firstname = "ZUber"
    email = "iamzuer@gmail.com"
    salt = "Vsv8SrrQf41sn7zWycxMt18LinszCTWs"

    expected_v1 = (
        "efda723fc9b4d5b1b18fbad7e230ff5c080f49c50dbc238a172c5fc65425e613"
        "1f146fc7e9043bbd25661c44db543b8d21c3ddfce9c71b43193cce67bfd3387b"
    )

    computed = _compute_payu_request_hash(
        key=key,
        txnid=txnid,
        amount_in_inr=amount_in_inr,
        productinfo=productinfo,
        firstname=firstname,
        email=email,
        salt=salt,
    )
    assert computed == expected_v1


def test_payu_hash_sample_latest_v1_v2():
    from app.api.v1.payments import _compute_payu_request_hash

    key = "OpJrSH"
    txnid = "PW2509140825550020"
    amount_in_inr = "500.00"
    productinfo = "Booking PW2509140036"
    firstname = "Zuber"
    email = "zuber@tdd.com"
    salt_v1 = "Vsv8SrrQf41sn7zWycxMt18LinszCTWs"
    salt_v2 = (
        "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDET9r2i0Wy8QdqSr4NUnVABU/2p9CHbfcHbJx8tFhjc8eqEfucGEkkgXmHjK9q6AEkoE3DUX+zumoAeZCJDemVacpDJilkDwd2CTIK0vvF9P/HG0ln49E4bsE5L3vCihJi+MESv9N23ECSpeIH7Q7wBC1uuk/9isT1FfCTtuCh+6hI5PLFgRNt0IpewoPPFdU8eqylDA5QBoAw4oQs0LVL0pyHdKFO17Ta790RBM08uoDGemueSqbp8RYQbqmOj1miO4Hzp/sNBDo6hwl3HPb2UJI5GdfpbP3Xb+DIin1LGFVv/T3vQcfNdnhWDIUYBY0vRL9FNOT+63xv8uTfmlLFAgMBAAECggEBAIcPrcULwtM+8uwVKjZ+Mb7vKLm5cUWLyXYpKmy9o0YhJRCEOMiHCON91MAGcbWqkwbA519m1eYwbbeP63nvwXITi52xRq7ZjDeQUgaSa7ghPEyfIFzCp3Ic+QFAAvSwC8BeBm/A3FsdY6vBRwZO+YT2Ss+wjVIRxDoecxsdqeSmy0ap+Ie4Y3Hyi5y/CzSxMcMsc8cBorooStnzsFsFIO81utn1+OWPKMlrKsnMivUwtKkzAnBULHm6FxeIg5zrWvYE+bzs5SAXs9cW1bXNqK3l04k5QPUmbHpCerW/gYUME8fFPjK5rHDqxnGnyVYQHHiBmf9EdPodVroSwi7y5qECgYEA8DoNz0ArstHIKBkhTFdaqES8LHdbM92Jq4PhP17Y28nPl7uJjHJPeCHVHEJ7U1XvsAmRoqd6fbZ5p12y/m06H3JZ9wMqiWFgWWFKkEdZwbmEXFcyOFx0RhqmJDSivL9k1qwTZmZUZZ0pEBxpTal8rRDQWXYK1TQ9giclVfyLxy0CgYEA0TOkPjxo/LEwEUo1OOCUBo5pNg9I3ODg1NJwvIxNo6udKUKfQ0jfemhVmdXktMk7B4zztfzJyTn4TJ4I2Yl0qNTFoIbEtbBb+JxbRSiW7NanWrUb9u10niOAuNuLddMWsjvwZOW9n0P9w7lPTnMqQ/29VfJUQyjxqXXnTgy6+PkCgYEAuGl4jG8QnLeaVd3kx/wPJjmN0vzVUJ1yv+3/jmw7QY5NBIf88YoXI3ulY4pNrg28cIEIAbtbtwHLpgWyEMq84cMg+RS/JLNSCYs8eEGtz5+g0lpFvSqMP/zZKdYWT5sFyB5Uzjkj9NWO3kVROUMw6JKNvv91FXKC/VUbvkSe8QkCgYAdV4jp0b9H8fIz+pyMZbNdWAwZsPsfP8tJDlsRlvwswJ1CdD2ySj5OBOQ8t2tkj/Tfkj18gQAsYR0aYfAL0uOx6mXtpflhImND82o5wP+qKFFAv7Y0ZAm/RGuBggmFdR3x0cZd4HtAI2EsWoltD2oWLzinHV4ELXH3urm+kLqIwQKBgGxDWl8pTdJe4/WYzRpyTyVwRgEkkgS987NGdMwzJpBfDbLH+5R9OPfrkq9Ga2oEJ6fjWDRNNqWFPjCjR11jHH4kQY1TxA9gtYwtOr3QjXBBKcQPo2GCJxfoa+njxVCSS8iQap/Om9LDdgxir8f3kauOEhmMR54Ua1neM+DMoccC"
    )

    expected_v1 = (
        "b8d95a708e1e1742918388fee24739081c390081efa24f4d5c19fb76fd0191b3"
        "be8330bf142b8ccfea73515102c2bc55fc140db8cdd30acfebc9c71c7355b0f3"
    )
    expected_v2 = (
        "fee596973a7853f287156f02bd77af8ea2f8d8f3dee2dcbd839b792061b9b320"
        "c4a7d52c9a144445df98365a0ff4aa907b700ba62e1b7472ffdeedfc32a6ea46"
    )

    computed_v1 = _compute_payu_request_hash(
        key=key,
        txnid=txnid,
        amount_in_inr=amount_in_inr,
        productinfo=productinfo,
        firstname=firstname,
        email=email,
        salt=salt_v1,
    )
    computed_v2 = _compute_payu_request_hash(
        key=key,
        txnid=txnid,
        amount_in_inr=amount_in_inr,
        productinfo=productinfo,
        firstname=firstname,
        email=email,
        salt=salt_v2,
    )

    assert computed_v1 == expected_v1
    assert computed_v2 == expected_v2


