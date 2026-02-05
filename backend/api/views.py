
# ========== ADMIN-ONLY CRUD ENDPOINTS =============
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, BasePermission
from rest_framework.response import Response
from .serializers import CategorySerializer, MenuItemSerializer, BlogPostSerializer, OpeningHoursSerializer
from .models import Category, MenuItem, BlogPost, OpeningHours


class IsAdmin(BasePermission):
    """
    Allows access only to admin users.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_staff)


@api_view(['POST', 'PUT', 'DELETE'])
@permission_classes([IsAdmin])
def admin_category_crud(request, pk=None):
    if request.method == 'POST':
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    elif request.method == 'PUT' and pk:
        try:
            category = Category.objects.get(pk=pk)
        except Category.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)
        serializer = CategorySerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    elif request.method == 'DELETE' and pk:
        try:
            category = Category.objects.get(pk=pk)
            category.delete()
            return Response(status=204)
        except Category.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)
    return Response({'error': 'Invalid request'}, status=400)

@api_view(['POST', 'PUT', 'DELETE'])
@permission_classes([IsAdmin])
def admin_menuitem_crud(request, pk=None):
    if request.method == 'POST':
        serializer = MenuItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    elif request.method == 'PUT' and pk:
        try:
            item = MenuItem.objects.get(pk=pk)
        except MenuItem.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)
        serializer = MenuItemSerializer(item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    elif request.method == 'DELETE' and pk:
        try:
            item = MenuItem.objects.get(pk=pk)
            item.delete()
            return Response(status=204)
        except MenuItem.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)
    return Response({'error': 'Invalid request'}, status=400)

@api_view(['POST', 'PUT', 'DELETE'])
@permission_classes([IsAdmin])
def admin_blog_crud(request, pk=None):
    if request.method == 'POST':
        serializer = BlogPostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    elif request.method == 'PUT' and pk:
        try:
            post = BlogPost.objects.get(pk=pk)
        except BlogPost.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)
        serializer = BlogPostSerializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    elif request.method == 'DELETE' and pk:
        try:
            post = BlogPost.objects.get(pk=pk)
            post.delete()
            return Response(status=204)
        except BlogPost.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)
    return Response({'error': 'Invalid request'}, status=400)

@api_view(['POST', 'PUT', 'DELETE'])
@permission_classes([IsAdmin])
def admin_opening_hours_crud(request, pk=None):
    if request.method == 'POST':
        serializer = OpeningHoursSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    elif request.method == 'PUT' and pk:
        try:
            oh = OpeningHours.objects.get(pk=pk)
        except OpeningHours.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)
        serializer = OpeningHoursSerializer(oh, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    elif request.method == 'DELETE' and pk:
        try:
            oh = OpeningHours.objects.get(pk=pk)
            oh.delete()
            return Response(status=204)
        except OpeningHours.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)
    return Response({'error': 'Invalid request'}, status=400)
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.middleware.csrf import get_token
from django_filters.rest_framework import DjangoFilterBackend

from .models import (
    Category, MenuItem, Order, TableReservation,
    Feedback, ContactMessage, BlogPost, RestaurantSettings, OpeningHours
)
from .serializers import (
    CategorySerializer, MenuItemSerializer, OrderSerializer,
    OrderCreateSerializer, TableReservationSerializer, FeedbackSerializer,
    ContactMessageSerializer, BlogPostSerializer, RestaurantSettingsSerializer,
    UserRegistrationSerializer, UserSerializer
)


class CategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint for menu categories. Read-only for public, write for admin only.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'
    
    def get_permissions(self):
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            permission_classes = [IsAdmin]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Category.objects.all()
        return Category.objects.filter(is_active=True)


class MenuItemViewSet(viewsets.ModelViewSet):
    """
    API endpoint for menu items. Read-only for public, write for admin only.
    """
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'is_vegetarian', 'is_vegan']
    search_fields = ['name', 'description']
    lookup_field = 'slug'
    
    def get_permissions(self):
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            permission_classes = [IsAdmin]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        if self.request.user.is_staff:
            return MenuItem.objects.all()
        return MenuItem.objects.filter(is_available=True)


class OrderViewSet(viewsets.ModelViewSet):
    """
    API endpoint for orders
    """
    queryset = Order.objects.all()
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'order_type']

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated:
            if self.request.user.is_staff:
                return Order.objects.all()
            return Order.objects.filter(user=self.request.user)
        return Order.objects.none()

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save()


class TableReservationViewSet(viewsets.ModelViewSet):
    """
    API endpoint for table reservations
    """
    queryset = TableReservation.objects.all()
    serializer_class = TableReservationSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            if self.request.user.is_staff:
                return TableReservation.objects.all()
            return TableReservation.objects.filter(user=self.request.user)
        return TableReservation.objects.none()

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save()


class FeedbackViewSet(viewsets.ModelViewSet):
    """
    API endpoint for feedback. Public users can submit, admins can publish/unpublish.
    """
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Feedback.objects.all()
        return Feedback.objects.filter(is_published=True)

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            permission_classes = [IsAdmin]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save()


class ContactMessageViewSet(viewsets.ModelViewSet):
    """
    API endpoint for contact messages
    """
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]
    http_method_names = ['post', 'get']

    def get_queryset(self):
        if self.request.user.is_staff:
            return ContactMessage.objects.all()
        return ContactMessage.objects.none()


class BlogPostViewSet(viewsets.ModelViewSet):
    """
    API endpoint for blog posts. Public can read published, admins can create/edit all.
    """
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    lookup_field = 'slug'

    def get_permissions(self):
        if self.request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
            permission_classes = [IsAdmin]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        if self.request.user.is_staff:
            return BlogPost.objects.all()
        return BlogPost.objects.filter(is_published=True)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
    lookup_field = 'slug'


class RestaurantSettingsViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for restaurant settings
    """
    queryset = RestaurantSettings.objects.all()
    serializer_class = RestaurantSettingsSerializer

    @action(detail=False, methods=['get'])
    def info(self, request):
        """Get restaurant info and opening hours"""
        settings = RestaurantSettings.objects.first()
        opening_hours = OpeningHours.objects.all()
        
        if settings:
            serializer = self.get_serializer(settings)
            return Response(serializer.data)
        
        return Response({
            'name': 'Spice Hub',
            'address': '32 Avenue Road',
            'postcode': 'WS10 8AR',
            'phone': '+44 121 568 8629',
            'email': 'spicehub32@gmail.com',
        })


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """User registration"""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            'user': UserSerializer(user).data,
            'message': 'User created successfully'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """User login"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    if user:
        login(request, user)
        return Response({
            'user': UserSerializer(user).data,
            'message': 'Login successful'
        })
    return Response({
        'error': 'Invalid credentials'
    }, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    """User logout"""
    logout(request)
    return Response({'message': 'Logout successful'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    """Get current user info"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)



from rest_framework.views import APIView
from django.conf import settings
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.middleware.csrf import get_token
from rest_framework.decorators import api_view, permission_classes
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie

@api_view(['GET', 'OPTIONS'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def csrf_token(request):
    """Get CSRF token for form submissions, with CORS headers and OPTIONS support"""
    if request.method == 'OPTIONS':
        response = Response()
    else:
        token = get_token(request)
        response = Response({'csrfToken': token})
    # Set CORS headers explicitly for preflight and GET
    origin = request.headers.get('Origin')
    allowed_origins = getattr(settings, 'CORS_ALLOWED_ORIGINS', [])
    if origin in allowed_origins:
        response['Access-Control-Allow-Origin'] = origin
        response['Access-Control-Allow-Credentials'] = 'true'
        response['Vary'] = 'Origin'
        response['Access-Control-Allow-Headers'] = 'Content-Type, X-CSRFToken'
        response['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
    return response


# ============================================================================
# ADMIN ENDPOINTS - DASHBOARD & MANAGEMENT
# ============================================================================

@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_dashboard_stats(request):
    """Get dashboard statistics for admin"""
    stats = {
        'total_orders': Order.objects.count(),
        'pending_orders': Order.objects.filter(status='pending').count(),
        'confirmed_orders': Order.objects.filter(status='confirmed').count(),
        'total_reservations': TableReservation.objects.count(),
        'pending_reservations': TableReservation.objects.filter(status='pending').count(),
        'total_feedback': Feedback.objects.count(),
        'published_feedback': Feedback.objects.filter(is_published=True).count(),
        'total_menu_items': MenuItem.objects.count(),
        'total_categories': Category.objects.count(),
        'total_blog_posts': BlogPost.objects.count(),
        'published_blog_posts': BlogPost.objects.filter(is_published=True).count(),
        'total_users': User.objects.count(),
        'contact_messages': ContactMessage.objects.count(),
    }
    return Response(stats)


@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_recent_orders(request):
    """Get recent orders for admin dashboard"""
    orders = Order.objects.all().order_by('-created_at')[:10]
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_recent_reservations(request):
    """Get recent reservations for admin dashboard"""
    reservations = TableReservation.objects.all().order_by('-created_at')[:10]
    serializer = TableReservationSerializer(reservations, many=True)
    return Response(serializer.data)


class AdminOrderDetailView(viewsets.ViewSet):
    """
    Admin-only view for detailed order management
    """
    permission_classes = [IsAdmin]

    def list(self, request):
        """List all orders with filters"""
        orders = Order.objects.all()
        
        # Filter by status
        status_filter = request.query_params.get('status')
        if status_filter:
            orders = orders.filter(status=status_filter)
        
        # Filter by order type
        order_type = request.query_params.get('order_type')
        if order_type:
            orders = orders.filter(order_type=order_type)
        
        # Filter by date range
        from_date = request.query_params.get('from_date')
        to_date = request.query_params.get('to_date')
        if from_date:
            orders = orders.filter(created_at__gte=from_date)
        if to_date:
            orders = orders.filter(created_at__lte=to_date)
        
        orders = orders.order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        """Get detailed order information"""
        try:
            order = Order.objects.get(id=pk)
            serializer = OrderSerializer(order)
            return Response(serializer.data)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

    def update_status(self, request, pk=None):
        """Update order status"""
        try:
            order = Order.objects.get(id=pk)
            new_status = request.data.get('status')
            
            valid_statuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled']
            if new_status not in valid_statuses:
                return Response({'error': f'Invalid status. Must be one of: {valid_statuses}'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            order.status = new_status
            order.save()
            
            serializer = OrderSerializer(order)
            return Response(serializer.data)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)


class AdminReservationDetailView(viewsets.ViewSet):
    """
    Admin-only view for detailed reservation management
    """
    permission_classes = [IsAdmin]

    def list(self, request):
        """List all reservations with filters"""
        reservations = TableReservation.objects.all()
        
        # Filter by status
        status_filter = request.query_params.get('status')
        if status_filter:
            reservations = reservations.filter(status=status_filter)
        
        # Filter by date
        reservation_date = request.query_params.get('date')
        if reservation_date:
            reservations = reservations.filter(reservation_date=reservation_date)
        
        reservations = reservations.order_by('-created_at')
        serializer = TableReservationSerializer(reservations, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        """Get detailed reservation information"""
        try:
            reservation = TableReservation.objects.get(id=pk)
            serializer = TableReservationSerializer(reservation)
            return Response(serializer.data)
        except TableReservation.DoesNotExist:
            return Response({'error': 'Reservation not found'}, status=status.HTTP_404_NOT_FOUND)

    def update_status(self, request, pk=None):
        """Update reservation status"""
        try:
            reservation = TableReservation.objects.get(id=pk)
            new_status = request.data.get('status')
            
            valid_statuses = ['pending', 'confirmed', 'completed', 'cancelled']
            if new_status not in valid_statuses:
                return Response({'error': f'Invalid status. Must be one of: {valid_statuses}'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            reservation.status = new_status
            reservation.save()
            
            serializer = TableReservationSerializer(reservation)
            return Response(serializer.data)
        except TableReservation.DoesNotExist:
            return Response({'error': 'Reservation not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_feedback_list(request):
    """List all feedback for admin moderation"""
    published = request.query_params.get('published')
    
    feedback = Feedback.objects.all()
    if published == 'true':
        feedback = feedback.filter(is_published=True)
    elif published == 'false':
        feedback = feedback.filter(is_published=False)
    
    feedback = feedback.order_by('-created_at')
    serializer = FeedbackSerializer(feedback, many=True)
    return Response(serializer.data)


@api_view(['PATCH'])
@permission_classes([IsAdmin])
def admin_publish_feedback(request, pk=None):
    """Publish or unpublish feedback"""
    try:
        feedback = Feedback.objects.get(id=pk)
        is_published = request.data.get('is_published')
        
        if is_published is not None:
            feedback.is_published = is_published
            feedback.save()
            serializer = FeedbackSerializer(feedback)
            return Response(serializer.data)
        
        return Response({'error': 'is_published field required'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    except Feedback.DoesNotExist:
        return Response({'error': 'Feedback not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_contact_messages(request):
    """List all contact messages for admin"""
    messages = ContactMessage.objects.all().order_by('-created_at')
    serializer = ContactMessageSerializer(messages, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_blog_posts(request):
    """List all blog posts (published and drafts) for admin"""
    posts = BlogPost.objects.all()
    
    published = request.query_params.get('published')
    if published == 'true':
        posts = posts.filter(is_published=True)
    elif published == 'false':
        posts = posts.filter(is_published=False)
    
    posts = posts.order_by('-created_at')
    serializer = BlogPostSerializer(posts, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_menu_stats(request):
    """Get menu statistics for admin"""
    stats = {
        'total_categories': Category.objects.count(),
        'active_categories': Category.objects.filter(is_active=True).count(),
        'total_items': MenuItem.objects.count(),
        'available_items': MenuItem.objects.filter(is_available=True).count(),
        'unavailable_items': MenuItem.objects.filter(is_available=False).count(),
        'vegetarian_items': MenuItem.objects.filter(is_vegetarian=True).count(),
        'vegan_items': MenuItem.objects.filter(is_vegan=True).count(),
        'categories_with_items': Category.objects.filter(items__isnull=False).distinct().count(),
    }
    return Response(stats)


@api_view(['GET', 'PUT'])
@permission_classes([IsAdmin])
def admin_restaurant_settings(request):
    """Get or update restaurant settings"""
    try:
        settings = RestaurantSettings.objects.first()
        
        if not settings:
            return Response({'error': 'Restaurant settings not configured'}, 
                           status=status.HTTP_404_NOT_FOUND)
        
        if request.method == 'GET':
            serializer = RestaurantSettingsSerializer(settings)
            return Response(serializer.data)
        
        elif request.method == 'PUT':
            serializer = RestaurantSettingsSerializer(settings, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
@permission_classes([IsAdmin])
def admin_opening_hours(request):
    """Get or update opening hours"""
    if request.method == 'GET':
        opening_hours = OpeningHours.objects.all()
        from .serializers import OpeningHoursSerializer
        serializer = OpeningHoursSerializer(opening_hours, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        from .serializers import OpeningHoursSerializer
        serializer = OpeningHoursSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'DELETE'])
@permission_classes([IsAdmin])
def admin_opening_hours_detail(request, pk=None):
    """Get or delete specific opening hours entry"""
    try:
        opening_hour = OpeningHours.objects.get(id=pk)
        
        if request.method == 'GET':
            from .serializers import OpeningHoursSerializer
            serializer = OpeningHoursSerializer(opening_hour)
            return Response(serializer.data)
        
        elif request.method == 'DELETE':
            opening_hour.delete()
            return Response({'message': 'Opening hour deleted'})
    
    except OpeningHours.DoesNotExist:
        return Response({'error': 'Opening hour not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_sales_analytics(request):
    """Get sales analytics data"""
    from django.db.models import Sum, Count
    from datetime import timedelta
    from django.utils import timezone
    
    # Orders this month
    this_month = timezone.now().replace(day=1)
    orders_this_month = Order.objects.filter(
        created_at__gte=this_month,
        status='completed'
    )
    
    # Orders this week
    week_ago = timezone.now() - timedelta(days=7)
    orders_this_week = Order.objects.filter(
        created_at__gte=week_ago,
        status='completed'
    )
    
    analytics = {
        'total_revenue': orders_this_month.aggregate(Sum('total'))['total__sum'] or 0,
        'this_month_orders': orders_this_month.count(),
        'this_week_orders': orders_this_week.count(),
        'average_order_value': orders_this_month.aggregate(Sum('total'))['total__sum'] / max(orders_this_month.count(), 1),
        'total_customers': Order.objects.values('customer_email').distinct().count(),
        'total_reservations_month': TableReservation.objects.filter(
            created_at__gte=this_month
        ).count(),
    }
    
    return Response(analytics)


@api_view(['POST'])
@permission_classes([IsAdmin])
def admin_bulk_update_items(request):
    """Bulk update menu items availability"""
    items_data = request.data.get('items', [])
    results = {'updated': 0, 'failed': 0, 'errors': []}
    
    for item_data in items_data:
        try:
            item = MenuItem.objects.get(id=item_data.get('id'))
            item.is_available = item_data.get('is_available', item.is_available)
            item.save()
            results['updated'] += 1
        except MenuItem.DoesNotExist:
            results['failed'] += 1
            results['errors'].append(f"Item {item_data.get('id')} not found")
    
    return Response(results)


@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_system_info(request):
    """Get system information for admin"""
    import django
    from django.conf import settings
    
    info = {
        'django_version': django.get_version(),
        'database': settings.DATABASES['default']['ENGINE'],
        'debug': settings.DEBUG,
        'timezone': settings.TIME_ZONE,
        'language_code': settings.LANGUAGE_CODE,
        'allowed_hosts': settings.ALLOWED_HOSTS,
    }
    
    return Response(info)
