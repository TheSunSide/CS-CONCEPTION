use criterion::{black_box, Criterion};
use hpc::questions::question4::{numerical_integration_cpu, numerical_integration_gpu};

pub fn bench(c: &mut Criterion) {
    let mut group = c.benchmark_group("question4");
    let to_integrate: Vec<f32> = (0..=500).into_iter().map(|i| i as f32 / 100.0).collect();
    group.bench_function("question 4 CPU", |b| {
        b.iter(|| numerical_integration_cpu(black_box(&to_integrate)))
    });
    group.bench_function("question 4 GPU", |b| {
        b.iter(|| numerical_integration_gpu(black_box(&to_integrate)))
    });
    group.finish();
}
