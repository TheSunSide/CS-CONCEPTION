#[cfg(test)]
mod tests;

pub fn single_threaded_computation(to_compute: &[u8]) -> Vec<f64> {
    let mut result = vec![];
    for &x in to_compute {
        let mut factorial = 1.0;
        for n in 2..=x {
            factorial *= n as f64;
        }
        result.push(factorial);
    }
    result
}

pub fn multi_threaded_computation(to_compute: &[u8]) -> Vec<f64> {
    todo!("Make this function multi-threaded with Rayon by writing it in a functional way. No for loop are allowed.");
}
