import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'spicehub.settings')
django.setup()

from django.contrib.auth.models import User

# Update admin user
try:
    admin = User.objects.filter(username='admin').first()
    if admin:
        # Set password
        admin.set_password('admin123')
        admin.is_staff = True
        admin.is_superuser = True
        admin.save()
        print(f"✓ Admin user configured successfully!")
        print(f"  Username: {admin.username}")
        print(f"  Password: admin123")
        print(f"  is_staff: {admin.is_staff}")
        print(f"  is_superuser: {admin.is_superuser}")
        print(f"\n  Django Admin: http://localhost:8000/admin")
    else:
        print("✗ No admin user found.")
except Exception as e:
    print(f"Error: {e}")
