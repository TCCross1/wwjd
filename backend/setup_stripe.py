"""Idempotent Stripe catalog setup for W.W.J.D. — $1/month gift subscription."""
from dotenv import load_dotenv
from pathlib import Path
import os
load_dotenv(Path(__file__).parent / ".env")
import stripe

stripe.api_key = os.environ["STRIPE_SECRET_KEY"]

EMERGENT_PRODUCT_ID = "wwjd_gift_subscription"
LOOKUP_KEY = "wwjd_monthly"
AMOUNT = 100  # $1.00
CURRENCY = "usd"


def get_or_create_product():
    for p in stripe.Product.list(active=True).auto_paging_iter():
        if p.to_dict().get("metadata", {}).get("emergent_product_id") == EMERGENT_PRODUCT_ID:
            return p
    return stripe.Product.create(
        name="W.W.J.D. — One Month Gift",
        description="A one-month gift of W.W.J.D. All proceeds help free people from the grip of addiction.",
        tax_code="txcd_10103001",
        metadata={"managed_by": "emergent", "emergent_product_id": EMERGENT_PRODUCT_ID},
    )


def ensure_price(product):
    existing = stripe.Price.list(lookup_keys=[LOOKUP_KEY], active=True, limit=1).data
    if existing and (existing[0].unit_amount != AMOUNT or existing[0].currency != CURRENCY):
        stripe.Price.modify(existing[0].id, active=False)
        existing = []
    if not existing:
        stripe.Price.create(
            product=product.id, unit_amount=AMOUNT, currency=CURRENCY,
            lookup_key=LOOKUP_KEY, transfer_lookup_key=True,
            recurring={"interval": "month"},
        )
        print(f"Created price {LOOKUP_KEY}")
    else:
        print(f"Price {LOOKUP_KEY} already exists")


if __name__ == "__main__":
    product = get_or_create_product()
    print(f"Product: {product.id}")
    ensure_price(product)
    print("Done.")
