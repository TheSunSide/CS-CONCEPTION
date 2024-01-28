@group(0)
@binding(0)
var<storage, read_write> v_indices: array<f32>; // this is used as both input and output for convenience

const pi: f32 = 3.1415926535897932384626433;

fn normal_distribution(x: f32) -> f32 {
    return exp(-0.5 * (x * x)) / sqrt(2 * pi);
}

/// TODO integrate between 0 and x the normal distribution with numerical integration and 32768 rectangles.
fn integrate(born: f32) -> f32 {
    var area = 0.0;
    let width: f32 = born / 32768.0;
    for (var i = 0; i < 32768; i += 1) {
        let x = f32(i) * width + 0.5 * width;
        area += width * normal_distribution(x);
    }
    return 0.5 + area;
}

@compute
@workgroup_size(1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    v_indices[global_id.x] = integrate(v_indices[global_id.x]);
}