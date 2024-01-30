#[cfg(test)]
mod tests;

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
    todo!("Multithread the computation with std::thread without using the return value of the thread. Use the good synchronisation primitive instead in a variable shared with the thread to return the result");
    let mut sum; // Give the appropriate type
    assert!(to_compute.len() >= 8);
    assert!(to_compute.len() % 8 == 0);
    sum
}
