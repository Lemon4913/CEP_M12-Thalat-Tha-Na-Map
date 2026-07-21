import os

from cryptography.fernet import Fernet


def _get_fernet() -> Fernet:
    key = os.environ["ENCRYPTION_KEY"]
    return Fernet(key)


def encrypt(plaintext: str) -> str:
    return _get_fernet().encrypt(plaintext.encode()).decode()


def decrypt(ciphertext: str) -> str:
    return _get_fernet().decrypt(ciphertext.encode()).decode()
