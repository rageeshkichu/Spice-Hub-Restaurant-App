from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet, basename='category')
router.register(r'menu-items', views.MenuItemViewSet, basename='menuitem')
router.register(r'orders', views.OrderViewSet, basename='order')
router.register(r'reservations', views.TableReservationViewSet, basename='reservation')
router.register(r'feedback', views.FeedbackViewSet, basename='feedback')
router.register(r'contact', views.ContactMessageViewSet, basename='contact')
router.register(r'blog', views.BlogPostViewSet, basename='blog')
router.register(r'settings', views.RestaurantSettingsViewSet, basename='settings')

# Admin ViewSets
admin_router = DefaultRouter()
admin_router.register(r'orders', views.AdminOrderDetailView, basename='admin-orders')
admin_router.register(r'reservations', views.AdminReservationDetailView, basename='admin-reservations')

urlpatterns = [
    path('', include(router.urls)),
    
    # Authentication endpoints
    path('auth/csrf/', views.csrf_token, name='csrf-token'),
    path('auth/register/', views.register_user, name='register'),
    path('auth/login/', views.login_user, name='login'),
    path('auth/logout/', views.logout_user, name='logout'),
    path('auth/user/', views.current_user, name='current-user'),
    
    # Admin endpoints
    path('admin/dashboard-stats/', views.admin_dashboard_stats, name='admin-dashboard-stats'),
    path('admin/recent-orders/', views.admin_recent_orders, name='admin-recent-orders'),
    path('admin/recent-reservations/', views.admin_recent_reservations, name='admin-recent-reservations'),
    path('admin/feedback/', views.admin_feedback_list, name='admin-feedback-list'),
    path('admin/feedback/<int:pk>/publish/', views.admin_publish_feedback, name='admin-publish-feedback'),
    path('admin/contact-messages/', views.admin_contact_messages, name='admin-contact-messages'),
    path('admin/blog/', views.admin_blog_posts, name='admin-blog-list'),
    path('admin/menu-stats/', views.admin_menu_stats, name='admin-menu-stats'),
    path('admin/settings/', views.admin_restaurant_settings, name='admin-settings'),
    path('admin/opening-hours/', views.admin_opening_hours, name='admin-opening-hours'),
    path('admin/opening-hours/<int:pk>/', views.admin_opening_hours_detail, name='admin-opening-hours-detail'),
    path('admin/sales-analytics/', views.admin_sales_analytics, name='admin-sales-analytics'),
    path('admin/bulk-update-items/', views.admin_bulk_update_items, name='admin-bulk-update-items'),
    path('admin/system-info/', views.admin_system_info, name='admin-system-info'),
    
    # Admin detail endpoints via viewsets
    path('admin/', include(admin_router.urls)),

    # Admin-only CRUD endpoints
    path('admin/categories/', views.admin_category_crud, name='admin-category-crud'),
    path('admin/categories/<int:pk>/', views.admin_category_crud, name='admin-category-crud-detail'),
    path('admin/menu-items/', views.admin_menuitem_crud, name='admin-menuitem-crud'),
    path('admin/menu-items/<int:pk>/', views.admin_menuitem_crud, name='admin-menuitem-crud-detail'),
    path('admin/blog/', views.admin_blog_crud, name='admin-blog-crud'),
    path('admin/blog/<int:pk>/', views.admin_blog_crud, name='admin-blog-crud-detail'),
    path('admin/opening-hours-crud/', views.admin_opening_hours_crud, name='admin-openinghours-crud'),
    path('admin/opening-hours-crud/<int:pk>/', views.admin_opening_hours_crud, name='admin-openinghours-crud-detail'),
]
