from django.contrib import admin
from .models import (
    Category, MenuItem, MenuItemPrice, Order, OrderItem,
    TableReservation, Feedback, ContactMessage, BlogPost,
    RestaurantSettings, OpeningHours
)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'order', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}


class MenuItemPriceInline(admin.TabularInline):
    model = MenuItemPrice
    extra = 1


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'is_vegetarian', 'is_vegan', 'is_available']
    list_filter = ['category', 'is_vegetarian', 'is_vegan', 'is_available']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    inlines = [MenuItemPriceInline]


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'customer_name', 'order_type', 'status', 'total', 'created_at']
    list_filter = ['status', 'order_type', 'created_at']
    search_fields = ['order_number', 'customer_name', 'customer_email', 'customer_phone']
    readonly_fields = ['order_number', 'created_at', 'updated_at']
    inlines = [OrderItemInline]


@admin.register(TableReservation)
class TableReservationAdmin(admin.ModelAdmin):
    list_display = ['customer_name', 'reservation_date', 'reservation_time', 'number_of_guests', 'status']
    list_filter = ['status', 'reservation_date']
    search_fields = ['customer_name', 'customer_email', 'customer_phone']


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ['name', 'rating', 'is_published', 'created_at']
    list_filter = ['rating', 'is_published', 'created_at']
    search_fields = ['name', 'email', 'message']


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'subject', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'is_published', 'published_date']
    list_filter = ['is_published', 'published_date']
    search_fields = ['title', 'content']
    prepopulated_fields = {'slug': ('title',)}


@admin.register(RestaurantSettings)
class RestaurantSettingsAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone', 'email', 'is_accepting_orders', 'is_accepting_reservations']


@admin.register(OpeningHours)
class OpeningHoursAdmin(admin.ModelAdmin):
    list_display = ['get_day_name', 'is_closed', 'opening_time', 'closing_time']
    
    def get_day_name(self, obj):
        return dict(OpeningHours.DAYS_OF_WEEK)[obj.day]
    get_day_name.short_description = 'Day'
