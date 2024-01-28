#[cfg(test)]
mod tests;

pub fn single_threaded_computation(to_compute: &[u128]) -> Vec<u128> {
    let mut result = vec![];
    for &x in to_compute {
        let mut factorial: u128 = 1;
        for i in 2..x {
            factorial *= i;
        }
        result.push(factorial);
    }
    result
}

/// TODO make this function multi-threaded with Rayon by rewriting in a functional way. No for loop are allowed.
pub fn multi_threaded_computation(to_compute: &[u128]) {}
