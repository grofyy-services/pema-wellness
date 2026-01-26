#!/usr/bin/env python3
"""
Debug PayU hash verification issue
"""

import hashlib
import json
from app.api.v1.payments import _compute_payu_request_hash, _compute_payu_response_hash_candidates

def debug_payu_hash():
    # Sample values from a recent payment
    key = "OpJrSH"
    salt = "Vsv8SrrQf41sn7zWycxMt18LinszCTWs"
    txnid = "PW2509141911400123"
    amount = "500.00"
    productinfo = "Booking PW2509130012"
    firstname = "Test"
    email = "test@example.com"
    udf1 = ""
    udf2 = ""
    udf3 = ""
    udf4 = ""
    udf5 = ""

    print("=== REQUEST HASH COMPUTATION ===")
    request_hash = _compute_payu_request_hash(
        key=key,
        txnid=txnid,
        amount_in_inr=amount,
        productinfo=productinfo,
        firstname=firstname,
        email=email,
        udf1=udf1,
        udf2=udf2,
        udf3=udf3,
        udf4=udf4,
        udf5=udf5,
        salt=salt
    )
    print(f"Request hash: {request_hash}")

    # Now simulate webhook response for SUCCESS
    print("\n=== RESPONSE HASH VERIFICATION ===")
    status = "success"
    email_candidates = [email]
    firstname_candidates = [firstname]
    productinfo_candidates = [productinfo]
    amount_candidates = [amount]

    expected_hashes = _compute_payu_response_hash_candidates(
        salts=[salt],
        status=status,
        email_candidates=email_candidates,
        firstname_candidates=firstname_candidates,
        productinfo_candidates=productinfo_candidates,
        amount_candidates=amount_candidates,
        txnid=txnid,
        key=key,
        udf1_candidates=[udf1],
        udf2_candidates=[udf2],
        udf3_candidates=[udf3],
        udf4_candidates=[udf4],
        udf5_candidates=[udf5],
        additional_charges=None
    )

    print(f"Expected response hashes ({len(expected_hashes)}):")
    for i, h in enumerate(expected_hashes[:5]):  # Show first 5
        print(f"  {i+1}: {h}")

    # What PayU might actually send (simulate)
    # According to PayU docs, the response hash should be: salt|status|||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
    # But let's check what the actual PayU documentation says vs what our code expects

    # Manual construction based on the formula in _compute_payu_response_hash_candidates variant 1
    manual_hash_string = f"{salt}|{status}|||||{udf5 or ''}|{udf4 or ''}|{udf3 or ''}|{udf2 or ''}|{udf1 or ''}|{email}|{firstname}|{productinfo}|{amount}|{txnid}|{key}"
    manual_hash = hashlib.sha512(manual_hash_string.encode()).hexdigest().lower()

    print(f"Manual hash string: {manual_hash_string}")
    print(f"Manual hash: {manual_hash}")

    # Let's also check what happens if PayU uses 10 blanks instead
    payu_10_blanks = f"{salt}|{status}{'|' * 10}{email}|{firstname}|{productinfo}|{amount}|{txnid}|{key}"
    payu_10_hash = hashlib.sha512(payu_10_blanks.encode()).hexdigest().lower()

    print(f"10 blanks hash string: {payu_10_blanks}")
    print(f"10 blanks hash: {payu_10_hash}")

    # Let's also check what happens if PayU uses 11 blanks
    payu_11_blanks = f"{salt}|{status}{'|' * 11}{email}|{firstname}|{productinfo}|{amount}|{txnid}|{key}"
    payu_11_hash = hashlib.sha512(payu_11_blanks.encode()).hexdigest().lower()

    print(f"11 blanks hash string: {payu_11_blanks}")
    print(f"11 blanks hash: {payu_11_hash}")

    print(f"\nChecking which variant matches:")
    print(f"Manual (classic) hash in expected: {manual_hash in expected_hashes}")
    print(f"10 blanks hash in expected: {payu_10_hash in expected_hashes}")
    print(f"11 blanks hash in expected: {payu_11_hash in expected_hashes}")

    # Check which one matches
    for i, expected in enumerate(expected_hashes):
        if expected == manual_hash:
            print(f"Manual hash matches expected at index {i}")
        if expected == payu_10_hash:
            print(f"10 blanks hash matches expected at index {i}")
        if expected == payu_11_hash:
            print(f"11 blanks hash matches expected at index {i}")

if __name__ == "__main__":
    debug_payu_hash()
