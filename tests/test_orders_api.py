"""
Test suite for GoSolo Orders & Admin Management APIs
Tests: User orders list, Admin orders, Status transitions
"""
import pytest
import requests
import os

BASE_URL = "http://localhost:3000"

# Test order IDs from seed data
PENDING_ORDER_ID = "a74e0fbb-f909-4a0f-adf8-d155a41ece1e"
SHIPPED_ORDER_ID = "a0e2b72f-2a9b-40fb-8819-dd6156233932"
PAID_ORDER_ID = "0445375c-b9ec-4e21-8ecd-0cc92f0740d2"


class TestUserOrdersAPI:
    """Tests for GET /api/orders/list - User orders endpoint"""

    def test_get_orders_list_success(self):
        """Should return list of orders with payment and item count"""
        response = requests.get(f"{BASE_URL}/api/orders/list")
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["success"] is True
        assert "orders" in data
        assert isinstance(data["orders"], list)
        assert len(data["orders"]) >= 1
        
    def test_orders_list_contains_required_fields(self):
        """Each order should have id, status, totalAmount, createdAt, payment, _count"""
        response = requests.get(f"{BASE_URL}/api/orders/list")
        data = response.json()
        
        for order in data["orders"]:
            assert "id" in order
            assert "status" in order
            assert "totalAmount" in order
            assert "createdAt" in order
            assert "payment" in order
            assert "_count" in order
            assert "items" in order["_count"]
            
    def test_orders_list_payment_has_status(self):
        """Payment object should have status field"""
        response = requests.get(f"{BASE_URL}/api/orders/list")
        data = response.json()
        
        for order in data["orders"]:
            if order["payment"]:
                assert "status" in order["payment"]


class TestAdminOrdersAPI:
    """Tests for GET /api/admin/orders - Admin orders endpoint"""

    def test_get_admin_orders_success(self):
        """Should return all orders with items details"""
        response = requests.get(f"{BASE_URL}/api/admin/orders")
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["success"] is True
        assert "orders" in data
        assert isinstance(data["orders"], list)
        
    def test_admin_orders_include_items(self):
        """Admin orders should include items with product details"""
        response = requests.get(f"{BASE_URL}/api/admin/orders")
        data = response.json()
        
        for order in data["orders"]:
            assert "items" in order
            if len(order["items"]) > 0:
                item = order["items"][0]
                assert "id" in item
                assert "quantity" in item
                assert "price" in item
                assert "product" in item
                assert "name" in item["product"]
                
    def test_admin_orders_include_payment_details(self):
        """Admin orders should include razorpayPaymentId in payment"""
        response = requests.get(f"{BASE_URL}/api/admin/orders")
        data = response.json()
        
        for order in data["orders"]:
            if order["payment"]:
                assert "status" in order["payment"]
                assert "razorpayPaymentId" in order["payment"]


class TestAdminOrderDetailAPI:
    """Tests for GET /api/admin/orders/[id] - Single order endpoint"""

    def test_get_order_by_id_success(self):
        """Should return order details by ID"""
        response = requests.get(f"{BASE_URL}/api/admin/orders/{PAID_ORDER_ID}")
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["success"] is True
        assert "order" in data
        assert data["order"]["id"] == PAID_ORDER_ID
        
    def test_get_order_includes_full_details(self):
        """Order should include payment and items with product details"""
        response = requests.get(f"{BASE_URL}/api/admin/orders/{PAID_ORDER_ID}")
        data = response.json()
        
        order = data["order"]
        assert "payment" in order
        assert "items" in order
        assert len(order["items"]) > 0
        
        # Check item has full product details
        item = order["items"][0]
        assert "product" in item
        assert "name" in item["product"]
        
    def test_get_nonexistent_order_returns_404(self):
        """Should return 404 for non-existent order"""
        response = requests.get(f"{BASE_URL}/api/admin/orders/non-existent-id")
        
        assert response.status_code == 404
        data = response.json()
        assert data["success"] is False
        assert "error" in data


class TestAdminStatusUpdateAPI:
    """Tests for PATCH /api/admin/orders/[id] - Status update endpoint"""

    def test_invalid_status_value_rejected(self):
        """Should reject invalid status values"""
        response = requests.patch(
            f"{BASE_URL}/api/admin/orders/{PAID_ORDER_ID}",
            json={"status": "INVALID_STATUS"},
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 400
        data = response.json()
        assert data["success"] is False
        assert "Invalid status value" in data["error"]
        
    def test_invalid_transition_pending_to_shipped_rejected(self):
        """PENDING cannot transition directly to SHIPPED"""
        # First, get current orders to find a PENDING one
        list_response = requests.get(f"{BASE_URL}/api/orders/list")
        orders = list_response.json()["orders"]
        pending_order = next((o for o in orders if o["status"] == "PENDING"), None)
        
        if pending_order:
            response = requests.patch(
                f"{BASE_URL}/api/admin/orders/{pending_order['id']}",
                json={"status": "SHIPPED"},
                headers={"Content-Type": "application/json"}
            )
            
            assert response.status_code == 400
            data = response.json()
            assert data["success"] is False
            assert "Invalid status transition" in data["error"]
            assert "allowedTransitions" in data
        else:
            pytest.skip("No PENDING order available for test")
            
    def test_invalid_transition_pending_to_delivered_rejected(self):
        """PENDING cannot transition directly to DELIVERED"""
        list_response = requests.get(f"{BASE_URL}/api/orders/list")
        orders = list_response.json()["orders"]
        pending_order = next((o for o in orders if o["status"] == "PENDING"), None)
        
        if pending_order:
            response = requests.patch(
                f"{BASE_URL}/api/admin/orders/{pending_order['id']}",
                json={"status": "DELIVERED"},
                headers={"Content-Type": "application/json"}
            )
            
            assert response.status_code == 400
            data = response.json()
            assert data["success"] is False
        else:
            pytest.skip("No PENDING order available for test")
            
    def test_delivered_order_cannot_change_status(self):
        """DELIVERED orders cannot change status"""
        list_response = requests.get(f"{BASE_URL}/api/orders/list")
        orders = list_response.json()["orders"]
        delivered_order = next((o for o in orders if o["status"] == "DELIVERED"), None)
        
        if delivered_order:
            response = requests.patch(
                f"{BASE_URL}/api/admin/orders/{delivered_order['id']}",
                json={"status": "SHIPPED"},
                headers={"Content-Type": "application/json"}
            )
            
            assert response.status_code == 400
            data = response.json()
            assert data["success"] is False
        else:
            pytest.skip("No DELIVERED order available for test")
            
    def test_same_status_update_succeeds(self):
        """Updating to same status should succeed with message"""
        list_response = requests.get(f"{BASE_URL}/api/orders/list")
        orders = list_response.json()["orders"]
        
        if orders:
            order = orders[0]
            response = requests.patch(
                f"{BASE_URL}/api/admin/orders/{order['id']}",
                json={"status": order["status"]},
                headers={"Content-Type": "application/json"}
            )
            
            assert response.status_code == 200
            data = response.json()
            assert data["success"] is True
            
    def test_update_nonexistent_order_returns_404(self):
        """Should return 404 when updating non-existent order"""
        response = requests.patch(
            f"{BASE_URL}/api/admin/orders/non-existent-id",
            json={"status": "PAID"},
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 404
        data = response.json()
        assert data["success"] is False


class TestStatusTransitionRules:
    """Tests for valid status transition rules"""
    
    def test_valid_transitions_from_paid(self):
        """PAID can transition to SHIPPED or CANCELLED"""
        list_response = requests.get(f"{BASE_URL}/api/orders/list")
        orders = list_response.json()["orders"]
        paid_order = next((o for o in orders if o["status"] == "PAID"), None)
        
        if paid_order:
            # Test transition to SHIPPED
            response = requests.patch(
                f"{BASE_URL}/api/admin/orders/{paid_order['id']}",
                json={"status": "SHIPPED"},
                headers={"Content-Type": "application/json"}
            )
            
            assert response.status_code == 200
            data = response.json()
            assert data["success"] is True
            assert data["order"]["status"] == "SHIPPED"
        else:
            pytest.skip("No PAID order available for test")
            
    def test_valid_transition_shipped_to_delivered(self):
        """SHIPPED can transition to DELIVERED"""
        list_response = requests.get(f"{BASE_URL}/api/orders/list")
        orders = list_response.json()["orders"]
        shipped_order = next((o for o in orders if o["status"] == "SHIPPED"), None)
        
        if shipped_order:
            response = requests.patch(
                f"{BASE_URL}/api/admin/orders/{shipped_order['id']}",
                json={"status": "DELIVERED"},
                headers={"Content-Type": "application/json"}
            )
            
            assert response.status_code == 200
            data = response.json()
            assert data["success"] is True
            assert data["order"]["status"] == "DELIVERED"
        else:
            pytest.skip("No SHIPPED order available for test")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
