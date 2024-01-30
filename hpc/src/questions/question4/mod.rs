use crate::setup::gpu_setup::apply_function_gpu;
use std::f32::consts::PI;

#[cfg(test)]
mod tests;

fn normal_distribution(x: f32) -> f32 {
    (-0.5 * (x.powi(2))).exp() / (2.0 * PI).sqrt()
}

fn numerical_integration_cpu_single(born: f32) -> f32 {
    let mut area = 0.0;
    let width = born / 32768.0;
    for i in 0..32768 {
        let x = i as f32 * width + 0.5 * width;
        area += width * normal_distribution(x);
    }
    0.5 + area
}

pub fn numerical_integration_cpu(to_integrate: &[f32]) -> Vec<f32> {
    to_integrate
        .iter()
        .map(|&x| numerical_integration_cpu_single(x))
        .collect()
}

pub fn numerical_integration_gpu(to_integrate: &[f32]) -> Vec<f32> {
    todo!("Write a shader to compute the integral of the normal distribution. You don't need to write any Rust code to make the shader work. Just remove this todo. See shader.wgsl");
    pollster::block_on(apply_function_gpu(
        include_str!("shader.wgsl"),
        to_integrate,
    ))
}
