from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/learn/basics')
def learn_basics():
    return render_template('learn/basics.html')

@app.route('/learn/basics/structure')
def learn_basic_structure():
    return render_template('learn/basics/structure.html')

@app.route('/learn/basics/beat')
def learn_basic_beat():
    return render_template('learn/basics/beat.html')

@app.route('/learn/basics/mixpoint')
def learn_basic_mixpoint():
    return render_template('learn/basics/mixpoint.html')

@app.route('/learn/basics/terms')
def learn_basic_terms():
    return render_template('learn/basics/terms.html')

@app.route('/learn/intermediate')
def learn_intermediate():
    return render_template('learn/intermediate.html')

@app.route('/learn/intermediate/eq')
def learn_intermediate_eq():
    return render_template('learn/intermediate/eq.html')

@app.route('/learn/intermediate/filter')
def learn_intermediate_filter():
    return render_template('learn/intermediate/filter.html')

@app.route('/learn/intermediate/fx')
def learn_intermediate_fx():
    return render_template('learn/intermediate/fx.html')

@app.route('/learn/intermediate/phrasing')
def learn_intermediate_phrasing():
    return render_template('learn/intermediate/phrasing.html')

@app.route('/learn/advanced')
def learn_advanced():
    return render_template('learn/advanced.html')

@app.route('/learn/advanced/setlist')
def learn_advanced_setlist():
    return render_template('learn/advanced/setlist.html')

@app.route('/learn/advanced/acappella')
def learn_advanced_acappella():
    return render_template('learn/advanced/acappella.html')

@app.route('/learn/advanced/performance')
def learn_advanced_performance():
    return render_template('learn/advanced/performance.html')

@app.route('/learn/advanced/recording')
def learn_advanced_recording():
    return render_template('learn/advanced/recording.html')

@app.route('/learn/resources')
def learn_resources():
    return render_template('learn/resources.html')

@app.route('/about')
def about():
    return render_template('about.html')

if __name__ == '__main__':
    app.run(debug=True)
