use criterion::{black_box, Criterion};
use hpc::questions::question3::{naive_xor_chunks, xor_chunks};

pub fn bench(c: &mut Criterion) {
    let mut group = c.benchmark_group("question3");
    group.bench_function("question 3 naive", |b| {
        b.iter(|| naive_xor_chunks(black_box([69; 4096]), black_box([42; 4096])))
    });
    group.bench_function("question 3", |b| {
        b.iter(|| xor_chunks(black_box([69; 4096]), black_box([42; 4096])))
    });
    group.finish();
}
