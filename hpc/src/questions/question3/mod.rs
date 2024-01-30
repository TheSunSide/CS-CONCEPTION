#[cfg(test)]
mod tests;

// This is an example of what it should do, you need to do it faster with SIMD.
pub fn naive_xor_chunks(a: [u8; 4096], b: [u8; 4096]) -> [u8; 4096] {
    let mut c = [0; 4096];
    for ((a, b), c) in a.into_iter().zip(b.into_iter()).zip(c.iter_mut()) {
        *c = a ^ b;
    }
    c
}

pub fn xor_chunks(a: [u8; 4096], b: [u8; 4096]) -> [u8; 4096] {
    todo!("XOR each byte of a with each byte of b and return the result faster than the naive implementation with SIMD. You can use the experimental features array_chunks and portable_simd.");
}
