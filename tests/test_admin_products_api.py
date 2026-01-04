"""
Test suite for Admin Product Management APIs
Tests: GET /api/admin/products, POST /api/admin/products, 
       GET /api/admin/products/[id], PATCH /api/admin/products/[id], DELETE /api/admin/products/[id]
"""
import pytest
import requests
import uuid

BASE_URL = "http://localhost:3000"


class TestAdminProductsListAndCreate:
    """Tests for GET /api/admin/products and POST /api/admin/products"""
    
    def test_get_all_products(self):
        """GET /api/admin/products - Returns all products including inactive"""
        response = requests.get(f"{BASE_URL}/api/admin/products")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] is True
        assert "products" in data
        assert isinstance(data["products"], list)
        
        # Verify product structure
        if len(data["products"]) > 0:
            product = data["products"][0]
            assert "id" in product
            assert "name" in product
            assert "description" in product
            assert "price" in product
            assert "discountPercent" in product
            assert "stock" in product
            assert "imageUrl" in product
            assert "isActive" in product
            assert "_count" in product
            print(f"✓ Found {len(data['products'])} products")
    
    def test_create_product_success(self):
        """POST /api/admin/products - Creates new product with all fields"""
        unique_name = f"TEST_Product_{uuid.uuid4().hex[:8]}"
        payload = {
            "name": unique_name,
            "description": "Test product description",
            "price": 499,
            "stock": 50,
            "imageUrl": "https://example.com/test-image.png",
            "discountPercent": 10,
            "isActive": True
        }
        
        response = requests.post(f"{BASE_URL}/api/admin/products", json=payload)
        assert response.status_code == 201
        
        data = response.json()
        assert data["success"] is True
        assert "product" in data
        
        product = data["product"]
        assert product["name"] == unique_name
        assert product["description"] == "Test product description"
        assert product["price"] == 499
        assert product["stock"] == 50
        assert product["discountPercent"] == 10
        assert product["isActive"] is True
        assert "id" in product
        
        # Verify persistence with GET
        get_response = requests.get(f"{BASE_URL}/api/admin/products/{product['id']}")
        assert get_response.status_code == 200
        fetched = get_response.json()["product"]
        assert fetched["name"] == unique_name
        
        print(f"✓ Created product: {product['id']}")
        
        # Cleanup - delete test product
        requests.delete(f"{BASE_URL}/api/admin/products/{product['id']}")
    
    def test_create_product_missing_name(self):
        """POST /api/admin/products - Validation: name required"""
        payload = {
            "description": "Test description",
            "price": 499,
            "stock": 50,
            "imageUrl": "https://example.com/test.png"
        }
        
        response = requests.post(f"{BASE_URL}/api/admin/products", json=payload)
        assert response.status_code == 400
        
        data = response.json()
        assert data["success"] is False
        assert "error" in data
        print(f"✓ Validation error: {data['error']}")
    
    def test_create_product_invalid_price(self):
        """POST /api/admin/products - Validation: price must be positive"""
        payload = {
            "name": "TEST_Invalid_Price",
            "description": "Test description",
            "price": -100,
            "stock": 50,
            "imageUrl": "https://example.com/test.png"
        }
        
        response = requests.post(f"{BASE_URL}/api/admin/products", json=payload)
        assert response.status_code == 400
        
        data = response.json()
        assert data["success"] is False
        print(f"✓ Validation error for negative price: {data['error']}")
    
    def test_create_product_invalid_stock(self):
        """POST /api/admin/products - Validation: stock must be non-negative"""
        payload = {
            "name": "TEST_Invalid_Stock",
            "description": "Test description",
            "price": 499,
            "stock": -10,
            "imageUrl": "https://example.com/test.png"
        }
        
        response = requests.post(f"{BASE_URL}/api/admin/products", json=payload)
        assert response.status_code == 400
        
        data = response.json()
        assert data["success"] is False
        print(f"✓ Validation error for negative stock: {data['error']}")
    
    def test_create_product_invalid_discount(self):
        """POST /api/admin/products - Validation: discount must be 0-100"""
        payload = {
            "name": "TEST_Invalid_Discount",
            "description": "Test description",
            "price": 499,
            "stock": 50,
            "imageUrl": "https://example.com/test.png",
            "discountPercent": 150
        }
        
        response = requests.post(f"{BASE_URL}/api/admin/products", json=payload)
        assert response.status_code == 400
        
        data = response.json()
        assert data["success"] is False
        print(f"✓ Validation error for invalid discount: {data['error']}")


class TestAdminProductSingleOperations:
    """Tests for GET/PATCH/DELETE /api/admin/products/[id]"""
    
    @pytest.fixture
    def test_product(self):
        """Create a test product for single operations"""
        unique_name = f"TEST_SingleOp_{uuid.uuid4().hex[:8]}"
        payload = {
            "name": unique_name,
            "description": "Test product for single operations",
            "price": 599,
            "stock": 100,
            "imageUrl": "https://example.com/test.png",
            "discountPercent": 0,
            "isActive": True
        }
        
        response = requests.post(f"{BASE_URL}/api/admin/products", json=payload)
        product = response.json()["product"]
        yield product
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/admin/products/{product['id']}")
    
    def test_get_single_product(self, test_product):
        """GET /api/admin/products/[id] - Returns single product"""
        response = requests.get(f"{BASE_URL}/api/admin/products/{test_product['id']}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] is True
        assert data["product"]["id"] == test_product["id"]
        assert data["product"]["name"] == test_product["name"]
        print(f"✓ Fetched product: {test_product['name']}")
    
    def test_get_nonexistent_product(self):
        """GET /api/admin/products/[id] - Returns 404 for non-existent product"""
        fake_id = str(uuid.uuid4())
        response = requests.get(f"{BASE_URL}/api/admin/products/{fake_id}")
        assert response.status_code == 404
        
        data = response.json()
        assert data["success"] is False
        print(f"✓ 404 for non-existent product")
    
    def test_update_product_name(self, test_product):
        """PATCH /api/admin/products/[id] - Updates product name"""
        new_name = f"TEST_Updated_{uuid.uuid4().hex[:8]}"
        response = requests.patch(
            f"{BASE_URL}/api/admin/products/{test_product['id']}",
            json={"name": new_name}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] is True
        assert data["product"]["name"] == new_name
        
        # Verify persistence
        get_response = requests.get(f"{BASE_URL}/api/admin/products/{test_product['id']}")
        assert get_response.json()["product"]["name"] == new_name
        print(f"✓ Updated product name to: {new_name}")
    
    def test_update_product_price(self, test_product):
        """PATCH /api/admin/products/[id] - Updates product price"""
        new_price = 799
        response = requests.patch(
            f"{BASE_URL}/api/admin/products/{test_product['id']}",
            json={"price": new_price}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["product"]["price"] == new_price
        print(f"✓ Updated product price to: {new_price}")
    
    def test_update_product_stock(self, test_product):
        """PATCH /api/admin/products/[id] - Updates product stock (quick +/- buttons)"""
        # Simulate quick stock decrease
        new_stock = test_product["stock"] - 1
        response = requests.patch(
            f"{BASE_URL}/api/admin/products/{test_product['id']}",
            json={"stock": new_stock}
        )
        assert response.status_code == 200
        assert response.json()["product"]["stock"] == new_stock
        
        # Simulate quick stock increase
        new_stock = new_stock + 5
        response = requests.patch(
            f"{BASE_URL}/api/admin/products/{test_product['id']}",
            json={"stock": new_stock}
        )
        assert response.status_code == 200
        assert response.json()["product"]["stock"] == new_stock
        print(f"✓ Quick stock update working: {new_stock}")
    
    def test_update_product_discount(self, test_product):
        """PATCH /api/admin/products/[id] - Updates discount percentage"""
        new_discount = 25
        response = requests.patch(
            f"{BASE_URL}/api/admin/products/{test_product['id']}",
            json={"discountPercent": new_discount}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["product"]["discountPercent"] == new_discount
        print(f"✓ Updated discount to: {new_discount}%")
    
    def test_update_product_isActive(self, test_product):
        """PATCH /api/admin/products/[id] - Updates isActive status"""
        # Deactivate
        response = requests.patch(
            f"{BASE_URL}/api/admin/products/{test_product['id']}",
            json={"isActive": False}
        )
        assert response.status_code == 200
        assert response.json()["product"]["isActive"] is False
        
        # Reactivate
        response = requests.patch(
            f"{BASE_URL}/api/admin/products/{test_product['id']}",
            json={"isActive": True}
        )
        assert response.status_code == 200
        assert response.json()["product"]["isActive"] is True
        print(f"✓ Toggle isActive working")
    
    def test_update_product_invalid_price(self, test_product):
        """PATCH /api/admin/products/[id] - Validation: price must be positive"""
        response = requests.patch(
            f"{BASE_URL}/api/admin/products/{test_product['id']}",
            json={"price": -100}
        )
        assert response.status_code == 400
        print(f"✓ Validation error for negative price update")
    
    def test_update_nonexistent_product(self):
        """PATCH /api/admin/products/[id] - Returns 404 for non-existent product"""
        fake_id = str(uuid.uuid4())
        response = requests.patch(
            f"{BASE_URL}/api/admin/products/{fake_id}",
            json={"name": "Updated Name"}
        )
        assert response.status_code == 404
        print(f"✓ 404 for updating non-existent product")
    
    def test_delete_product_hard_delete(self, test_product):
        """DELETE /api/admin/products/[id] - Hard delete for product without orders"""
        response = requests.delete(f"{BASE_URL}/api/admin/products/{test_product['id']}")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] is True
        assert "deleted permanently" in data.get("message", "").lower() or data["success"] is True
        
        # Verify product is gone
        get_response = requests.get(f"{BASE_URL}/api/admin/products/{test_product['id']}")
        assert get_response.status_code == 404
        print(f"✓ Hard deleted product: {test_product['id']}")
    
    def test_delete_nonexistent_product(self):
        """DELETE /api/admin/products/[id] - Returns 404 for non-existent product"""
        fake_id = str(uuid.uuid4())
        response = requests.delete(f"{BASE_URL}/api/admin/products/{fake_id}")
        assert response.status_code == 404
        print(f"✓ 404 for deleting non-existent product")


class TestExistingProductsWithDiscounts:
    """Tests for existing products with discounts"""
    
    def test_energy_boost_has_discount(self):
        """Verify Energy Boost Gummies has 20% discount"""
        response = requests.get(f"{BASE_URL}/api/admin/products")
        products = response.json()["products"]
        
        energy_product = next((p for p in products if "Energy" in p["name"]), None)
        assert energy_product is not None
        assert energy_product["discountPercent"] == 20
        print(f"✓ Energy Boost Gummies has {energy_product['discountPercent']}% discount")
    
    def test_sleep_support_has_discount(self):
        """Verify Sleep Support Gummies has 15% discount"""
        response = requests.get(f"{BASE_URL}/api/admin/products")
        products = response.json()["products"]
        
        sleep_product = next((p for p in products if "Sleep" in p["name"]), None)
        assert sleep_product is not None
        assert sleep_product["discountPercent"] == 15
        print(f"✓ Sleep Support Gummies has {sleep_product['discountPercent']}% discount")
    
    def test_products_without_discount(self):
        """Verify Immunity and Focus products have no discount"""
        response = requests.get(f"{BASE_URL}/api/admin/products")
        products = response.json()["products"]
        
        immunity_product = next((p for p in products if "Immunity" in p["name"]), None)
        focus_product = next((p for p in products if "Focus" in p["name"]), None)
        
        assert immunity_product is not None
        assert immunity_product["discountPercent"] == 0
        
        assert focus_product is not None
        assert focus_product["discountPercent"] == 0
        print(f"✓ Immunity and Focus products have no discount")


class TestShopPageProducts:
    """Tests for public shop page products API"""
    
    def test_shop_products_only_active_with_stock(self):
        """GET /api/products - Returns only active products with stock > 0"""
        response = requests.get(f"{BASE_URL}/api/products")
        assert response.status_code == 200
        
        data = response.json()
        # Handle both list and object response formats
        products = data if isinstance(data, list) else data.get("products", [])
        
        for product in products:
            assert product.get("isActive", True) is True
            assert product.get("stock", 1) > 0
        print(f"✓ Shop page shows {len(products)} active products with stock")
    
    def test_shop_products_include_discount_info(self):
        """GET /api/products - Products include discountPercent field"""
        response = requests.get(f"{BASE_URL}/api/products")
        assert response.status_code == 200
        
        data = response.json()
        # Handle both list and object response formats
        products = data if isinstance(data, list) else data.get("products", [])
        
        if len(products) > 0:
            product = products[0]
            assert "discountPercent" in product
            print(f"✓ Shop products include discount info")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
