#!/usr/bin/env python3
"""
Hugo App v2 - API Testing Script
This script tests all the backend services to ensure they're working correctly.
"""

import requests
import json
import time
import sys
from typing import Dict, Any

# Configuration
BASE_URL = "http://localhost"
SERVICES = {
    "user-service": 8001,
    "hugo-engine": 8002,
    "assessment-service": 8003,
    "team-service": 8004,
    "chat-assessment-service": 8005
}

class APITester:
    def __init__(self):
        self.auth_token = None
        self.user_id = None
        self.assessment_id = None
        self.team_id = None
        
    def test_service_health(self, service_name: str, port: int) -> bool:
        """Test if a service is healthy"""
        try:
            response = requests.get(f"http://localhost:{port}/health", timeout=5)
            if response.status_code == 200:
                print(f"✅ {service_name} is healthy")
                return True
            else:
                print(f"❌ {service_name} health check failed: {response.status_code}")
                return False
        except requests.exceptions.RequestException as e:
            print(f"❌ {service_name} is not accessible: {e}")
            return False
    
    def test_user_service(self) -> bool:
        """Test user service functionality"""
        print("\n🧪 Testing User Service...")
        
        # Test user registration
        user_data = {
            "email": "test@hugo.com",
            "password": "testpassword123",
            "first_name": "Test",
            "last_name": "User"
        }
        
        try:
            response = requests.post(f"http://localhost:8001/register", json=user_data)
            if response.status_code == 200:
                user_info = response.json()
                self.user_id = user_info["id"]
                print(f"✅ User registration successful: {user_info['email']}")
            else:
                print(f"❌ User registration failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ User registration error: {e}")
            return False
        
        # Test user login
        login_data = {
            "email": "test@hugo.com",
            "password": "testpassword123"
        }
        
        try:
            response = requests.post(f"http://localhost:8001/login", json=login_data)
            if response.status_code == 200:
                token_info = response.json()
                self.auth_token = token_info["access_token"]
                print(f"✅ User login successful")
            else:
                print(f"❌ User login failed: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"❌ User login error: {e}")
            return False
        
        # Test get current user
        headers = {"Authorization": f"Bearer {self.auth_token}"}
        try:
            response = requests.get(f"http://localhost:8001/me", headers=headers)
            if response.status_code == 200:
                user_info = response.json()
                print(f"✅ Get current user successful: {user_info['first_name']} {user_info['last_name']}")
                return True
            else:
                print(f"❌ Get current user failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Get current user error: {e}")
            return False
    
    def test_hugo_engine(self) -> bool:
        """Test Hugo Engine service functionality"""
        print("\n🧪 Testing Hugo Engine...")
        
        # Test get all Hugo types
        try:
            response = requests.get(f"http://localhost:8002/types")
            if response.status_code == 200:
                types = response.json()
                print(f"✅ Retrieved {len(types)} Hugo personality types")
            else:
                print(f"❌ Get Hugo types failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Get Hugo types error: {e}")
            return False
        
        # Test get specific Hugo type
        try:
            response = requests.get(f"http://localhost:8002/types/V1")
            if response.status_code == 200:
                type_info = response.json()
                print(f"✅ Retrieved Hugo type: {type_info['name']} ({type_info['code']})")
            else:
                print(f"❌ Get specific Hugo type failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Get specific Hugo type error: {e}")
            return False
        
        # Test personality analysis
        scores = {
            "Vision": 0.8,
            "Innovation": 0.6,
            "Expertise": 0.4,
            "Connection": 0.7
        }
        
        try:
            response = requests.post(f"http://localhost:8002/analyze-scores", json=scores)
            if response.status_code == 200:
                analysis = response.json()
                print(f"✅ Personality analysis successful: {analysis['primary_type']['name']}")
                return True
            else:
                print(f"❌ Personality analysis failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Personality analysis error: {e}")
            return False
    
    def test_assessment_service(self) -> bool:
        """Test Assessment service functionality"""
        print("\n🧪 Testing Assessment Service...")
        
        if not self.user_id:
            print("❌ Cannot test assessment service without user ID")
            return False
        
        # Test get assessment questions
        try:
            response = requests.get(f"http://localhost:8003/questions")
            if response.status_code == 200:
                questions = response.json()
                print(f"✅ Retrieved {len(questions)} assessment questions")
            else:
                print(f"❌ Get assessment questions failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Get assessment questions error: {e}")
            return False
        
        # Test create assessment
        assessment_data = {"user_id": self.user_id}
        try:
            response = requests.post(f"http://localhost:8003/", json=assessment_data)
            if response.status_code == 200:
                result = response.json()
                self.assessment_id = result["assessment_id"]
                print(f"✅ Assessment created successfully")
            else:
                print(f"❌ Create assessment failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Create assessment error: {e}")
            return False
        
        # Test submit assessment (simplified)
        if self.assessment_id and questions:
            answers = []
            for i, question in enumerate(questions[:2]):  # Just test with first 2 questions
                answers.append({
                    "question_id": question["id"],
                    "answer_value": "A"  # Simplified answer
                })
            
            submission_data = {
                "assessment_id": self.assessment_id,
                "answers": answers
            }
            
            try:
                response = requests.post(f"http://localhost:8003/submit", json=submission_data)
                if response.status_code == 200:
                    result = response.json()
                    print(f"✅ Assessment submission successful")
                    return True
                else:
                    print(f"❌ Assessment submission failed: {response.status_code}")
                    return False
            except Exception as e:
                print(f"❌ Assessment submission error: {e}")
                return False
        
        return True
    
    def test_team_service(self) -> bool:
        """Test Team service functionality"""
        print("\n🧪 Testing Team Service...")
        
        if not self.user_id:
            print("❌ Cannot test team service without user ID")
            return False
        
        # Test create team
        team_data = {
            "name": "Test Development Team",
            "description": "A test team for API testing",
            "created_by": self.user_id
        }
        
        try:
            response = requests.post(f"http://localhost:8004/", json=team_data)
            if response.status_code == 200:
                result = response.json()
                self.team_id = result["team_id"]
                print(f"✅ Team created successfully")
            else:
                print(f"❌ Create team failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Create team error: {e}")
            return False
        
        # Test get team
        if self.team_id:
            try:
                response = requests.get(f"http://localhost:8004/{self.team_id}")
                if response.status_code == 200:
                    team_info = response.json()
                    print(f"✅ Retrieved team: {team_info['name']}")
                    return True
                else:
                    print(f"❌ Get team failed: {response.status_code}")
                    return False
            except Exception as e:
                print(f"❌ Get team error: {e}")
                return False
        
        return True
    
    def run_all_tests(self) -> bool:
        """Run all tests"""
        print("🚀 Starting Hugo App v2 API Tests...\n")
        
        # Test service health
        print("📊 Testing Service Health...")
        all_healthy = True
        for service_name, port in SERVICES.items():
            if not self.test_service_health(service_name, port):
                all_healthy = False
        
        if not all_healthy:
            print("\n❌ Some services are not healthy. Please check your Docker containers.")
            return False
        
        # Test individual services
        tests = [
            ("User Service", self.test_user_service),
            ("Hugo Engine", self.test_hugo_engine),
            ("Assessment Service", self.test_assessment_service),
            ("Team Service", self.test_team_service)
        ]
        
        results = []
        for test_name, test_func in tests:
            try:
                result = test_func()
                results.append((test_name, result))
            except Exception as e:
                print(f"❌ {test_name} test failed with exception: {e}")
                results.append((test_name, False))
        
        # Print summary
        print("\n" + "="*50)
        print("📋 TEST SUMMARY")
        print("="*50)
        
        passed = 0
        for test_name, result in results:
            status = "✅ PASSED" if result else "❌ FAILED"
            print(f"{test_name}: {status}")
            if result:
                passed += 1
        
        print(f"\nTotal: {passed}/{len(results)} tests passed")
        
        if passed == len(results):
            print("\n🎉 All tests passed! Hugo App v2 is working correctly.")
            return True
        else:
            print(f"\n⚠️  {len(results) - passed} test(s) failed. Please check the logs above.")
            return False

def main():
    """Main function"""
    print("Hugo App v2 - API Testing Script")
    print("=" * 40)
    
    # Wait a moment for services to be ready
    print("⏳ Waiting for services to be ready...")
    time.sleep(2)
    
    tester = APITester()
    success = tester.run_all_tests()
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
