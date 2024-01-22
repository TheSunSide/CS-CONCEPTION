#![feature(portable_simd, array_chunks)]
use std::arch::x86_64::_mm256_xor_si256;
use std::{
    arch::x86_64::__m256i,
    fs::File,
    io::{Read, Write},
    simd::u8x32,
    time::Instant,
};

// pub fn part1() {
//     let time = Instant::now();
//     let mut key = File::open("data/key.bin").unwrap();
//     let mut encrypted = File::open("data/encrypted.bin").unwrap();
//     let mut result = File::create("data/new").unwrap();
//     let mut page_key = [0u8; 4096];
//     let mut page_encrypted = [0u8; 4096];
//     let mut page_result = [0u8; 4096];
//     while let (Ok(()), Ok(())) = (
//         key.read_exact(&mut page_key),
//         encrypted.read_exact(&mut page_encrypted),
//     ) {
//         for i in 0..4096 / 32 {
//             let key = u8x32::from_slice(&page_key[32 * i..32 * (i + 1)]);
//             let encrypted = u8x32::from_slice(&page_encrypted[32 * i..32 * (i + 1)]);
//             page_result[32 * i..32 * (i + 1)].copy_from_slice((key ^ encrypted).as_array());
//         }
//         let _ = result.write_all(&page_result);
//     }
//     println!("{}", time.elapsed().as_secs_f64());
// }

#[inline(always)]
pub fn part1(a: [u8; 4096], b: [u8; 4096]) -> [u8; 4096] {
    let mut page_result = [0; 4096];
    // for ((a, b), c) in a.into_iter().zip(b.into_iter()).zip(page_result.iter_mut()) {
    //     *c = a ^ b;
    // }
    for ((a, b), c) in a
        .array_chunks::<32>()
        .zip(b.array_chunks::<32>())
        .zip(page_result.array_chunks_mut::<32>())
    {
        let a = __m256i::from(u8x32::from_array(*a));
        let b = __m256i::from(u8x32::from_array(*b));
        let result = unsafe { _mm256_xor_si256(a, b) };
        let result = u8x32::from(result).to_array();
        c.copy_from_slice(&result);
    }
    page_result
}

pub fn part12() {
    let time = Instant::now();
    let mut key = File::open("data/key.bin").unwrap();
    let mut encrypted = File::open("data/encrypted.bin").unwrap();
    let mut result = File::create("data/new").unwrap();
    let mut page_key = [0u8; 4096];
    let mut page_encrypted = [0u8; 4096];
    let mut page_result = [0u8; 4096];
    while let (Ok(()), Ok(())) = (
        key.read_exact(&mut page_key),
        encrypted.read_exact(&mut page_encrypted),
    ) {
        for i in 0..4096 / 32 {
            let key = u8x32::from_slice(&page_key[32 * i..32 * (i + 1)]);
            let encrypted = u8x32::from_slice(&page_encrypted[32 * i..32 * (i + 1)]);
            page_result[32 * i..32 * (i + 1)].copy_from_slice((key ^ encrypted).as_array());
        }
        let _ = result.write_all(&page_result);
    }
    println!("{}", time.elapsed().as_secs_f64());
}
