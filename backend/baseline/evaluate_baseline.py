# baseline/evaluate_baseline.py
import joblib
from datasets import load_dataset
from sklearn.metrics import accuracy_score, classification_report


def eval_baseline(model_path='models/baseline/model.joblib'):
    print('Loading model...')
    model = joblib.load(model_path)
    ds = load_dataset('imdb')
    X_test = ds['test']['text']
    y_test = ds['test']['label']

    preds = model.predict(X_test)
    print('Accuracy:', accuracy_score(y_test, preds))
    print(classification_report(y_test, preds))


if __name__ == '__main__':
    eval_baseline()
