use criterion::{black_box, Criterion};
use hpc::questions::question1::{multi_threaded_computation, single_threaded_computation};

pub fn bench(c: &mut Criterion) {
    let mut group = c.benchmark_group("question1");
    let to_compute: Vec<u8> = (0..=169).collect();
    group.bench_function("question 1 single-thread", |b| {
        b.iter(|| single_threaded_computation(black_box(&to_compute)))
    });
    group.bench_function("question 1 multi-thread", |b| {
        b.iter(|| multi_threaded_computation(black_box(&to_compute)))
    });
    group.finish();
}
