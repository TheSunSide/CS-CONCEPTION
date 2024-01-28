mod question3;
mod question4;

use criterion::{criterion_group, criterion_main, Criterion};

fn criterion_benchmark(c: &mut Criterion) {
    question3::bench(c);
    question4::bench(c);
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
