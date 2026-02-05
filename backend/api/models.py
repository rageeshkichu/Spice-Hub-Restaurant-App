from django.db import models
from django.contrib.auth.models import User


class Category(models.Model):
    """Menu categories like Grill, Wraps, Wings, etc."""
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['order', 'name']

    def __str__(self):
        return self.name


class MenuItem(models.Model):
    """Individual menu items"""
    PORTION_CHOICES = [
        ('starter', 'Starter'),
        ('main', 'Main'),
        ('regular', 'Regular'),
        ('meal_deal', 'Meal Deal'),
        ('single', 'Single'),
    ]

    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='items')
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='menu_items/', blank=True, null=True)
    is_vegetarian = models.BooleanField(default=False)
    is_vegan = models.BooleanField(default=False)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class MenuItemPrice(models.Model):
    """Pricing for different portions (starter, main, regular, meal deal)"""
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name='prices')
    portion_type = models.CharField(max_length=20, choices=MenuItem.PORTION_CHOICES)
    price = models.DecimalField(max_digits=6, decimal_places=2)

    class Meta:
        unique_together = ['menu_item', 'portion_type']

    def __str__(self):
        return f"{self.menu_item.name} - {self.portion_type}: £{self.price}"


class Order(models.Model):
    """Customer orders"""
    ORDER_TYPE_CHOICES = [
        ('delivery', 'Delivery'),
        ('collection', 'Collection'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('preparing', 'Preparing'),
        ('ready', 'Ready'),
        ('out_for_delivery', 'Out for Delivery'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    order_number = models.CharField(max_length=50, unique=True)
    order_type = models.CharField(max_length=20, choices=ORDER_TYPE_CHOICES, default='delivery')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Customer details
    customer_name = models.CharField(max_length=100)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=20)
    
    # Delivery details
    delivery_address = models.TextField(blank=True)
    delivery_postcode = models.CharField(max_length=10, blank=True)
    
    # Order details
    subtotal = models.DecimalField(max_digits=8, decimal_places=2)
    delivery_fee = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=8, decimal_places=2)
    
    notes = models.TextField(blank=True)
    requested_time = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Order {self.order_number} - {self.customer_name}"


class OrderItem(models.Model):
    """Items in an order"""
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    menu_item = models.ForeignKey(MenuItem, on_delete=models.PROTECT)
    portion_type = models.CharField(max_length=20)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    special_instructions = models.TextField(blank=True)

    def __str__(self):
        return f"{self.quantity}x {self.menu_item.name} ({self.portion_type})"


class TableReservation(models.Model):
    """Table booking/reservation"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reservations')
    customer_name = models.CharField(max_length=100)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=20)
    
    reservation_date = models.DateField()
    reservation_time = models.TimeField()
    number_of_guests = models.PositiveIntegerField()
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    special_requests = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-reservation_date', '-reservation_time']

    def __str__(self):
        return f"{self.customer_name} - {self.reservation_date} at {self.reservation_time}"


class Feedback(models.Model):
    """Customer feedback"""
    RATING_CHOICES = [(i, str(i)) for i in range(1, 6)]

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    rating = models.IntegerField(choices=RATING_CHOICES)
    message = models.TextField()
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.rating} stars"


class ContactMessage(models.Model):
    """Contact form submissions"""
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.subject}"


class BlogPost(models.Model):
    """Blog posts"""
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    content = models.TextField()
    excerpt = models.TextField(blank=True)
    image = models.ImageField(upload_to='blog/', blank=True, null=True)
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    is_published = models.BooleanField(default=False)
    published_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-published_date']

    def __str__(self):
        return self.title


class RestaurantSettings(models.Model):
    """Restaurant settings and information"""
    DAYS_OF_WEEK = [
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    ]

    name = models.CharField(max_length=100, default='Spice Hub')
    address = models.TextField(default='32 Avenue Road')
    postcode = models.CharField(max_length=20, default='WS10 8AR')
    phone = models.CharField(max_length=20, default='+44 121 568 8629')
    email = models.EmailField(default='spicehub32@gmail.com')
    
    delivery_fee = models.DecimalField(max_digits=6, decimal_places=2, default=2.50)
    minimum_order = models.DecimalField(max_digits=6, decimal_places=2, default=10.00)
    
    facebook_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    
    is_accepting_orders = models.BooleanField(default=True)
    is_accepting_reservations = models.BooleanField(default=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'Restaurant Settings'


class OpeningHours(models.Model):
    """Opening hours for each day"""
    DAYS_OF_WEEK = [
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    ]

    day = models.IntegerField(choices=DAYS_OF_WEEK, unique=True)
    is_closed = models.BooleanField(default=False)
    opening_time = models.TimeField(null=True, blank=True)
    closing_time = models.TimeField(null=True, blank=True)

    class Meta:
        ordering = ['day']
        verbose_name_plural = 'Opening Hours'

    def __str__(self):
        day_name = dict(self.DAYS_OF_WEEK)[self.day]
        if self.is_closed:
            return f"{day_name}: Closed"
        return f"{day_name}: {self.opening_time} - {self.closing_time}"
