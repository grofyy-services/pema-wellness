#!/usr/bin/env python3
"""
Test Rate model creation
"""

import sys
import os
from datetime import date

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_rate_model():
    """Test Rate model creation"""

    try:
        from app.models.ids_booking import Rate

        print("🧪 Testing Rate Model Creation")
        print("=" * 40)

        # Test the Rate model
        rate = Rate(
            effective_date=date(2025, 10, 25),
            expire_date=date(2025, 10, 27),
            rate_time_unit="Day",
            unit_multiplier=1,
            base={"@AmountAfterTax": "250000", "@CurrencyCode": "INR"}
        )

        print(" Rate model created successfully!")
        print(f"   Effective Date: {rate.effective_date}")
        print(f"   Expire Date: {rate.expire_date}")
        print(f"   Rate Time Unit: {rate.rate_time_unit}")
        print(f"   Unit Multiplier: {rate.unit_multiplier}")
        print(f"   Base: {rate.base}")

        # Test model_dict() to see XML structure
        rate_dict = rate.model_dump(by_alias=True)
        print("\n Rate model as dict:")
        print(f"   {rate_dict}")

    except Exception as e:
        print(f" Rate model test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_rate_model()
