use super::*;

#[test]
fn exhaustive_test() {
    let to_compute: Vec<f64> = (0..1_000_000).map(|x| x as f64 / 10_000.0).collect();
    assert_eq!(
        single_threaded_computation(&to_compute),
        multi_threaded_computation(&to_compute)
    );
}
