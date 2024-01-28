use super::*;

#[test]
fn exhaustive_test() {
    let to_compute: Vec<u8> = (0..=169).collect();
    assert_eq!(
        single_threaded_computation(&to_compute),
        multi_threaded_computation(&to_compute)
    )
}
