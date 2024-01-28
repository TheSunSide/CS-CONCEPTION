use super::*;

#[test]
fn exhaustive_test() {
    let to_integrate: Vec<f32> = (0..=500).into_iter().map(|i| i as f32 / 100.0).collect();
    let given_results = numerical_integration_gpu(&to_integrate);
    let expected_results = numerical_integration_cpu(&to_integrate);
    for ((a, b), x) in given_results
        .into_iter()
        .zip(expected_results.into_iter())
        .zip(to_integrate)
    {
        assert!((b - a).abs() < 0.0001, "{} != {} for F({})", a, b, x)
    }
}
