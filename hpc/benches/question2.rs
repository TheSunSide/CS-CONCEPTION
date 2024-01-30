use criterion::{black_box, Criterion};
use hpc::questions::question2::{multi_threaded_computation, single_threaded_computation};

pub fn bench(c: &mut Criterion) {
    let mut group = c.benchmark_group("question2");
    let to_compute: Vec<f64> = (0..1_000_000).map(|x| x as f64 / 10_000.0).collect();

    group.bench_function("question 2 single-thread", |b| {
        b.iter(|| single_threaded_computation(black_box(&to_compute)))
    });
    group.bench_function("question 2 multi-thread", |b| {
        b.iter(|| multi_threaded_computation(black_box(&to_compute)))
    });
    group.finish();
}
