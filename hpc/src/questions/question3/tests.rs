use super::*;
use rand::{thread_rng, RngCore};

#[test]
fn monkey_test() {
    let mut thread_rng = thread_rng();
    let mut a = [0u8; 4096];
    thread_rng.fill_bytes(&mut a);
    let mut b = [0u8; 4096];
    thread_rng.fill_bytes(&mut b);
    let given_c = xor_chunks(a, b);
    let expected_c = naive_xor_chunks(a, b);
    assert_eq!(given_c, expected_c);
}
