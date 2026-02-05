from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Category, MenuItem, MenuItemPrice, Order, OrderItem,
    TableReservation, Feedback, ContactMessage, BlogPost,
    RestaurantSettings, OpeningHours
)


class MenuItemPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItemPrice
        fields = ['id', 'portion_type', 'price']


class MenuItemSerializer(serializers.ModelSerializer):
    prices = MenuItemPriceSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = MenuItem
        fields = [
            'id', 'category', 'category_name', 'name', 'slug',
            'description', 'image', 'is_vegetarian', 'is_vegan',
            'is_available', 'prices', 'created_at'
        ]


class CategorySerializer(serializers.ModelSerializer):
    items = MenuItemSerializer(many=True, read_only=True)
    item_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            'id', 'name', 'slug', 'description', 'image',
            'order', 'is_active', 'items', 'item_count'
        ]

    def get_item_count(self, obj):
        return obj.items.filter(is_available=True).count()


class OrderItemSerializer(serializers.ModelSerializer):
    menu_item_name = serializers.CharField(source='menu_item.name', read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            'id', 'menu_item', 'menu_item_name', 'portion_type',
            'quantity', 'price', 'special_instructions'
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'order_type', 'status',
            'customer_name', 'customer_email', 'customer_phone',
            'delivery_address', 'delivery_postcode',
            'subtotal', 'delivery_fee', 'total', 'notes',
            'requested_time', 'items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['order_number', 'created_at', 'updated_at']


class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = [
            'order_type', 'customer_name', 'customer_email',
            'customer_phone', 'delivery_address', 'delivery_postcode',
            'subtotal', 'delivery_fee', 'total', 'notes',
            'requested_time', 'items'
        ]

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # Generate order number
        import uuid
        order_number = f"SH{uuid.uuid4().hex[:8].upper()}"
        
        order = Order.objects.create(order_number=order_number, **validated_data)
        
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        
        return order


class TableReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TableReservation
        fields = [
            'id', 'customer_name', 'customer_email', 'customer_phone',
            'reservation_date', 'reservation_time', 'number_of_guests',
            'status', 'special_requests', 'created_at'
        ]
        read_only_fields = ['status', 'created_at']


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = [
            'id', 'name', 'email', 'phone', 'rating',
            'message', 'is_published', 'created_at'
        ]
        read_only_fields = ['is_published', 'created_at']


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = [
            'id', 'name', 'email', 'phone', 'subject',
            'message', 'created_at'
        ]
        read_only_fields = ['created_at']


class BlogPostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'content', 'excerpt',
            'image', 'author', 'author_name', 'is_published',
            'published_date', 'created_at'
        ]


class OpeningHoursSerializer(serializers.ModelSerializer):
    day_name = serializers.SerializerMethodField()

    class Meta:
        model = OpeningHours
        fields = ['id', 'day', 'day_name', 'is_closed', 'opening_time', 'closing_time']

    def get_day_name(self, obj):
        return dict(OpeningHours.DAYS_OF_WEEK)[obj.day]


class RestaurantSettingsSerializer(serializers.ModelSerializer):
    opening_hours = OpeningHoursSerializer(source='openinghours_set', many=True, read_only=True)

    class Meta:
        model = RestaurantSettings
        fields = [
            'id', 'name', 'address', 'postcode', 'phone', 'email',
            'delivery_fee', 'minimum_order', 'facebook_url',
            'instagram_url', 'twitter_url', 'is_accepting_orders',
            'is_accepting_reservations', 'opening_hours'
        ]


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'first_name', 'last_name']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords don't match")
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    is_admin = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_admin']

    def get_is_admin(self, obj):
        return obj.is_staff
