import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from joblib import dump

# Step 1: Simulate basic traffic data
# Features: duration, protocol_type, src_bytes, dst_bytes
# Label: 0 (normal), 1 (attack)
data = {
    "duration": [1, 10, 5, 100, 200, 2, 30, 50, 1, 300],
    "protocol_type": [0, 1, 0, 1, 1, 0, 0, 1, 0, 1],  # 0 = TCP, 1 = UDP
    "src_bytes": [500, 1000, 400, 8000, 9000, 100, 600, 2000, 50, 10000],
    "dst_bytes": [300, 400, 500, 12000, 15000, 50, 300, 5000, 40, 20000],
    "label": [0, 0, 0, 1, 1, 0, 0, 1, 0, 1]
}

df = pd.DataFrame(data)

# Step 2: Split features and labels
X = df.drop("label", axis=1)
y = df["label"]

# Step 3: Split into training/test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Step 4: Train the model
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)

# Step 5: Evaluate the model
y_pred = clf.predict(X_test)
print(classification_report(y_test, y_pred))

# Step 6: Save the model
dump(clf, "rf_traffic_model.joblib")
print("Model saved as rf_traffic_model.joblib")
