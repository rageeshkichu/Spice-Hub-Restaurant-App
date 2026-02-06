import logging
import os

from django.apps import AppConfig


logger = logging.getLogger(__name__)


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        if os.getenv("CREATE_SUPERUSER", "false").lower() != "true":
            return

        username = os.getenv("DJANGO_SUPERUSER_USERNAME")
        email = os.getenv("DJANGO_SUPERUSER_EMAIL")
        password = os.getenv("DJANGO_SUPERUSER_PASSWORD")

        if not username or not password:
            logger.warning("CREATE_SUPERUSER set but username/password missing.")
            return

        from django.contrib.auth import get_user_model

        User = get_user_model()
        if User.objects.filter(username=username).exists():
            logger.info("Superuser '%s' already exists.", username)
            return

        User.objects.create_superuser(username=username, email=email or "", password=password)
        logger.info("Superuser '%s' created.", username)
