#!/usr/bin/env python
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'spicehub.settings')
sys.path.insert(0, r'd:\Desktop\Projects\Spice Hub\backend')

django.setup()

from django.contrib.auth.models import User
from django.contrib.auth import authenticate

# Check if admin exists
try:
    admin = User.objects.get(username='admin')
    print(f"✅ Admin exists: {admin.username}")
    print(f"   Is Staff: {admin.is_staff}")
    print(f"   Is Superuser: {admin.is_superuser}")
except User.DoesNotExist:
    print("Creating admin user...")
    admin = User.objects.create_user(
        username='admin', 
        email='admin@spicehub.com',
        password='admin123', 
        is_staff=True, 
        is_superuser=True
    )
    print(f"✅ Admin created: {admin.username}")
    print(f"   Is Staff: {admin.is_staff}")

# Test authentication
auth_user = authenticate(username='admin', password='admin123')
if auth_user:
    print(f"\n✅ Authentication works: {auth_user.username}")
else:
    print("\n❌ Authentication failed")
