use criterion::{criterion_group, criterion_main, Criterion, black_box};
use hpc::part1;

fn criterion_benchmark(c: &mut Criterion) {
    c.bench_function("part 1", |b| b.iter(|| part1(black_box([69; 4096]), black_box([42; 4096]))));
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);