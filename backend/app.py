from flask import Flask

from app.routes.health import health_bp
from app.routes.monitoring import monitoring_bp

app = Flask(__name__)

app.register_blueprint(health_bp)
app.register_blueprint(monitoring_bp)


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True,
    )