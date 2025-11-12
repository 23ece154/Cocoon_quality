

// Create a simple model
const model = tf.sequential();
model.add(tf.layers.dense({ units: 8, activation: 'relu', inputShape: [2] }));
model.add(tf.layers.dense({ units: 3, activation: 'softmax' }));

model.compile({
  optimizer: tf.train.adam(),
  loss: 'categoricalCrossentropy',
  metrics: ['accuracy'],
});

// Dummy data (replace later with real IoT data)
const xs = tf.tensor2d([
  [0.2, 0.3],
  [0.8, 0.6],
  [0.4, 0.9],
  [0.9, 0.1],
]);

const ys = tf.tensor2d([
  [1, 0, 0], // Good
  [0, 1, 0], // Average
  [0, 0, 1], // Poor
  [1, 0, 0], // Good
]);

async function trainAndSaveModel() {
  await model.fit(xs, ys, { epochs: 50 });
  await model.save('file://./model');
  console.log('✅ Model trained and saved in ./model/');
}

trainAndSaveModel();
