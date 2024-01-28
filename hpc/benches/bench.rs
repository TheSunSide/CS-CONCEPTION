mod question1;
mod question2;
mod question3;
mod question4;

use criterion::{criterion_group, criterion_main, Criterion};

fn criterion_benchmark(c: &mut Criterion) {
    question1::bench(c);
    question2::bench(c);
    question3::bench(c);
    question4::bench(c);
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
