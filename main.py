from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware  
from sqlalchemy.orm import Session
from database import engine, get_db
import models, schemas

# Kothaga add chesina Email imports
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# 0. EMAIL FUNCTION (Kotha Code)
# ==========================================
def send_order_confirmation_email(to_email, order_id, quantity):
    sender_email = os.getenv("SENDER_EMAIL")
    sender_password = os.getenv("SENDER_PASSWORD")

    if not sender_email or not sender_password:
        return

    msg = MIMEMultipart()
    msg['From'] = f"Inventory System <{sender_email}>"
    msg['To'] = to_email
    msg['Cc'] = sender_email  # Sender ki kooda mail vellela CC add chesam
    msg['Subject'] = f"Order Confirmation - #{order_id}"
    
    # Anti-Spam Trick: Reply-To header add chesthunnam
    msg.add_header('reply-to', sender_email)

    body = f"""Hello,

Your order has been successfully placed in our Inventory System.

Order Details:
- Order ID: #{order_id}
- Quantity: {quantity}

Thank you for your business!
"""
    msg.attach(MIMEText(body, 'plain'))

    # Ikkada To mariyu Cc iddariki mail vellela list pass chesthunnam
    recipients = [to_email, sender_email]

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, recipients, msg.as_string())
        server.quit()
        print(f"✅ Email Sent Successfully to: {to_email} & {sender_email}")
    except Exception as e:
        print(f"❌ Email Failed: {e}")
# 1. PRODUCT ENDPOINTS
# ==========================================
@app.post("/products", response_model=schemas.ProductResponse)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.sku == product.sku).first()
    if db_product:
        raise HTTPException(status_code=400, detail="Product with this SKU already exists")
    
    new_product = models.Product(**product.model_dump())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@app.get("/products", response_model=list[schemas.ProductResponse])
def get_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()

# ==========================================
# 2. CUSTOMER ENDPOINTS
# ==========================================
@app.post("/customers", response_model=schemas.CustomerResponse)
def create_customer(customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    db_customer = db.query(models.Customer).filter(models.Customer.email == customer.email).first()
    if db_customer:
        raise HTTPException(status_code=400, detail="Customer with this Email already exists")
        
    new_customer = models.Customer(**customer.model_dump())
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    return new_customer

@app.get("/customers", response_model=list[schemas.CustomerResponse])
def get_customers(db: Session = Depends(get_db)):
    return db.query(models.Customer).all()

# ==========================================
# 3. ORDER ENDPOINTS (Updated with Email)
# ==========================================
@app.post("/orders", response_model=schemas.OrderResponse)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == order.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    customer = db.query(models.Customer).filter(models.Customer.id == order.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    if product.stock_quantity < order.quantity:
        raise HTTPException(status_code=400, detail="Insufficient product stock")
    
    total_price = product.price * order.quantity
    
    product.stock_quantity -= order.quantity
    
    new_order = models.Order(
        customer_id=order.customer_id,
        product_id=order.product_id,
        quantity=order.quantity,
        total_price=total_price,
        status="Completed"
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    # Email function ni ikkada call chesthunnam
    send_order_confirmation_email(customer.email, new_order.id, new_order.quantity)

    return new_order

@app.get("/orders", response_model=list[schemas.OrderResponse])
def get_orders(db: Session = Depends(get_db)):
    return db.query(models.Order).all()