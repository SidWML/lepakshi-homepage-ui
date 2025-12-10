"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import {
  Breadcrumb,
  Footer,
} from "@/components/ui";
import {
  getCategoryUrl,
  type Category,
  type CategoryGroup
} from "@/lib/data/products";

interface ParentContentProps {
  parentGroup: CategoryGroup;
  categories: Category[];
}

export default function ParentContent({ parentGroup, categories }: ParentContentProps) {
  return (
    <>
      <Header variant="solid" />

      {/* Hero Banner */}
      <section className="relative pt-20">
        <div className="relative h-[280px] md:h-[350px] bg-gradient-to-r from-[#2d2a26] to-[#3d3428] overflow-hidden">
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <pattern id="parent-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" fill="currentColor" />
              </pattern>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#parent-pattern)" className="text-[#c9a227]" />
            </svg>
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Content */}
          <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center">
            {/* Breadcrumb */}
            <Breadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: parentGroup.name },
              ]}
              className="mb-4 text-white/80"
            />

            <motion.h1
              className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {parentGroup.name}
            </motion.h1>
            <motion.p
              className="text-white/70 text-lg max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {parentGroup.tagline}
            </motion.p>
          </div>

          {/* Decorative Elements */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-[#c9a227]/10 rounded-full blur-3xl" />
          <div className="absolute right-20 bottom-0 w-32 h-32 bg-[#c9a227]/20 rounded-full blur-2xl" />
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 md:py-16 bg-[#faf8f5] min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-6">
          {categories.length > 0 ? (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <Link
                    href={getCategoryUrl(category)}
                    className="group block"
                  >
                    <div className="aspect-[4/5] bg-white border border-[#e5e0d5] overflow-hidden relative group-hover:border-[#c9a227] transition-all duration-300 group-hover:shadow-lg">
                      {category.image ? (
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br ${category.color}`} />
                      )}

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                      {/* Category Info */}
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <span className="text-[#f7d794] text-[10px] tracking-[0.2em] uppercase mb-1 block">
                          {category.tagline}
                        </span>
                        <h3 className="font-[family-name:var(--font-playfair)] text-xl text-white mb-2 group-hover:text-[#f7d794] transition-colors">
                          {category.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-white/60 text-sm">
                            {category.subcategories.length} subcategories
                          </span>
                          <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#c9a227] transition-all">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-[#e5e0d5]">
              <svg className="w-16 h-16 mx-auto mb-4 text-[#c9a227]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-[#666] mb-2">No categories available</p>
              <Link href="/" className="text-[#c9a227] hover:underline text-sm">
                Return to Home
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
