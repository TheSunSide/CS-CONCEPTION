#[cfg(test)]
mod tests;

use std::simd::u8x32;

// This is an example of what it should do, you need to do it faster with SIMD.
pub fn naive_xor_chunks(a: [u8; 4096], b: [u8; 4096]) -> [u8; 4096] {
    let mut c = [0; 4096];
    for ((a, b), c) in a.into_iter().zip(b.into_iter()).zip(c.iter_mut()) {
        *c = a ^ b;
    }
    c
}

/// TODO xor each byte of a with each byte of b and return the result faster than the naive implementation with SIMD
pub fn xor_chunks(a: [u8; 4096], b: [u8; 4096]) -> [u8; 4096] {
    naive_xor_chunks(a, b)
}

pub fn xor_chunks_solution(a: [u8; 4096], b: [u8; 4096]) -> [u8; 4096] {
    let mut c = [0; 4096];
    for ((a, b), c) in a
        .array_chunks::<32>()
        .zip(b.array_chunks::<32>())
        .zip(c.array_chunks_mut::<32>())
    {
        let a = u8x32::from_array(*a);
        let b = u8x32::from_array(*b);
        let result = (a ^ b).to_array();
        c.copy_from_slice(&result);
    }
    c
}
