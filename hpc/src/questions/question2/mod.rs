#[cfg(test)]
mod tests;

use std::{
    sync::{
        atomic::{AtomicU64, Ordering},
        Arc,
    },
    thread,
};

fn get_first_digit(number: f64) -> u64 {
    (number / 10f64.powi(number.log10().floor() as i32)) as u64
}

pub fn single_threaded_computation(to_compute: &[f64]) -> u64 {
    let mut sum = 0;
    for &x in to_compute {
        sum += get_first_digit(x.exp());
    }
    sum
}

pub fn multi_threaded_computation(to_compute: &[f64]) -> u64 {
    todo!("Multithread the computation with std::thread without using the return value of the thread. Use the good synchronisation primitive instead");

    assert!(to_compute.len() >= 8);
    assert!(to_compute.len() % 8 == 0);
}

pub fn multi_threaded_computation_solution(to_compute: &[f64]) -> u64 {
    assert!(to_compute.len() >= 8);
    assert!(to_compute.len() % 8 == 0);

    let sum = Arc::new(AtomicU64::new(0));
    let mut gulag = vec![];

    for i in 0..8 {
        let sum = sum.clone();
        let slice_size = to_compute.len() / 8;
        let to_compute_slice = to_compute[slice_size * i..slice_size * (i + 1)].to_vec();
        let worker = thread::spawn(move || {
            let internal_sum: u64 = to_compute_slice
                .into_iter()
                .map(|x| get_first_digit(x.exp()))
                .sum();
            sum.fetch_add(internal_sum, Ordering::Relaxed);
        });

        gulag.push(worker);
    }

    for worker in gulag {
        let _ = worker.join();
    }

    sum.load(Ordering::Relaxed)
}
