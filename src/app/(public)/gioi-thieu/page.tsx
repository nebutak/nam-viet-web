"use client";

import Image from "next/image";
import { ShieldCheck, HeartPulse, Lightbulb, TrendingUp, Handshake, CheckCircle2, ChevronRight, GraduationCap, Leaf, Globe2, Building2 } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      {/* ── Hero Section ── */}
      <section className="relative w-full -mt-[80px] pt-[180px] pb-32 bg-emerald-900 border-b-8 border-emerald-700 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/carousel/carousel-01.png"
            alt="Nam Việt Corporation"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-emerald-900/60 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-black/40 to-transparent" />
          {/* Top fade for header */}
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white/95 via-white/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-800/30 border border-emerald-500/30 backdrop-blur-md mb-6">
            <Leaf size={16} className="text-emerald-300" />
            <span className="text-sm font-bold text-emerald-100 uppercase tracking-widest">Tin cậy & Bền vững</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
            Câu Chuyện Nam Việt
          </h1>
          <p className="mx-auto max-w-3xl text-lg md:text-xl font-medium text-emerald-50 leading-relaxed drop-shadow-sm">
            Khát vọng kiến tạo một nền Công nghiệp Sản xuất và Thương mại Xanh, mang đến giá trị đích thực và lợi ích bền vững cho hàng triệu đối tác.
          </p>
        </div>
      </section>

      {/* ── Về Chúng Tôi (Introduction) ── */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-100 rounded-full blur-[100px] opacity-50 -translate-y-1/2 translate-x-1/3"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative hidden md:block">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform -rotate-2 hover:rotate-0 transition-transform duration-500 z-10">
                <Image src="/images/carousel/carousel-02.png" alt="Khởi nguồn Nam Việt" fill className="object-cover" />
              </div>
              <div className="absolute -bottom-10 -right-10 w-2/3 aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform rotate-3 hover:rotate-0 transition-transform duration-500 z-0">
                <Image src="/images/carousel/carousel-03.png" alt="Sản xuất Nam Việt" fill className="object-cover" />
              </div>
            </div>
            
            <div className="lg:pl-8 mt-4 lg:mt-0">
              <h2 className="text-sm font-black text-emerald-600 uppercase tracking-widest mb-3">Về Nam Việt</h2>
              <h3 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-6 leading-tight">
                Vững bước tiên phong trong lĩnh vực <br/><span className="text-emerald-600">Sản xuất & Thương mại</span>
              </h3>
              <p className="text-slate-600 text-lg mb-6 leading-relaxed font-medium">
                Nằm ngay gần trung tâm kinh tế trọng điểm, với sự hỗ trợ mạnh mẽ và tiềm lực vững chắc, <strong className="text-emerald-700">Nam Việt</strong> chính thức ra đời mang theo sứ mệnh nâng tầm chuỗi giá trị.
              </p>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed font-medium">
                Chúng tôi không ngừng nghỉ trong việc phân phối hàng trăm loại sản phẩm hàng hóa, thành phẩm chất lượng cao; hợp tác chuyển giao công nghệ kỹ thuật tiên tiến để tối ưu hóa năng suất và định hình xu hướng sản xuất Xanh, hướng tới tương lai.
              </p>
              
              <div className="grid grid-cols-2 gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex flex-col gap-2">
                  <span className="text-4xl font-black text-emerald-600">15+</span>
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Năm Kinh Nghiệm</span>
                </div>
                <div className="flex flex-col gap-2 border-l border-slate-100 pl-6">
                  <span className="text-4xl font-black text-emerald-600">9</span>
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Chi Nhánh Cấp 1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tầm Nhìn & Sứ Mệnh ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-black text-emerald-600 uppercase tracking-widest mb-3">Khát Vọng</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-800">Tầm Nhìn & Sứ Mệnh</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:border-emerald-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <Globe2 size={28} />
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-4">Dẫn đầu Khu vực</h4>
              <p className="text-slate-600 font-medium leading-relaxed">
                Định hướng trở thành công ty tư nhân hàng đầu khu vực về nghiên cứu, phân phối ứng dụng các sản phẩm công nghệ cao.
              </p>
            </div>
            
            {/* Card 2 */}
            <div className="bg-emerald-700 rounded-3xl p-8 border border-emerald-600 shadow-lg hover:-translate-y-2 transition-transform duration-300 transform md:scale-105 z-10 group">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white mb-6 group-hover:bg-white group-hover:text-emerald-700 transition-colors">
                <HeartPulse size={28} />
              </div>
              <h4 className="text-xl font-bold text-white mb-4">Gia tăng Giá trị</h4>
              <p className="text-emerald-50 font-medium leading-relaxed">
                Cam kết tạo ra giá trị cao nhất cho khách hàng, gia tăng chất lượng cuộc sống và lợi ích bền vững của đối tác.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:border-emerald-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <Leaf size={28} />
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-4">Công nghệ Xanh</h4>
              <p className="text-slate-600 font-medium leading-relaxed">
                Tiêu chí cốt lõi "Công nghệ xanh cho thực phẩm sạch". Tiên phong ứng dụng an toàn sinh học vào môi trường sản xuất.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Giá Trị Cốt Lõi ── */}
      <section id="gia-tri" className="py-24 bg-slate-900 text-white relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-black text-emerald-400 uppercase tracking-widest mb-3">Nền Tảng</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white">5 Giá Trị Cốt Lõi</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
            {[
              { title: "Đạo Đức", icon: <ShieldCheck size={28} />, desc: "Hành động chuẩn mực cao nhất, đặt giá trị lên trên lợi ích tạm thời." },
              { title: "Khách Hàng", icon: <HeartPulse size={28} />, desc: "Trung tâm của sự phục vụ. Lắng nghe và thấu hiểu triệt để." },
              { title: "Sáng Tạo", icon: <Lightbulb size={28} />, desc: "Chưa bao giờ thỏa mãn, ứng dụng công nghệ tạo biên độ khác biệt." },
              { title: "Chất Lượng", icon: <CheckCircle2 size={28} />, desc: "Yếu tố then chốt cho sự phát triển. Nâng cao chuẩn mực liên tục." },
              { title: "Hợp Lực", icon: <Handshake size={28} />, desc: "Hợp lực cùng đối tác và vươn xa vì sự phát triển cộng hưởng chung." },
            ].map((core, i) => (
              <div key={i} className="group bg-slate-800/80 hover:bg-emerald-800/50 border border-slate-700 hover:border-emerald-500/50 rounded-3xl p-6 transition-all duration-300">
                <div className="w-14 h-14 bg-slate-700/80 group-hover:bg-emerald-600 rounded-2xl flex items-center justify-center text-emerald-400 group-hover:text-white mb-6 transition-all shadow-inner">
                  {core.icon}
                </div>
                <h4 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-200 transition-colors">{core.title}</h4>
                <p className="text-sm text-slate-400 font-medium leading-relaxed group-hover:text-slate-300 transition-colors">{core.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lịch Sử Hình Thành ── */}
      <section id="lich-su" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-sm font-black text-emerald-600 uppercase tracking-widest mb-3">Hành Trình</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-800">Cột Mốc Phát Triển</h3>
          </div>

          <div className="relative border-l-4 border-emerald-100 ml-4 lg:ml-12 pl-8 lg:pl-16 space-y-16 py-4">
            {[
              { year: "2001", title: "Khởi Đầu Gian Nan", desc: "Được ấp ủ và hình thành sơ khai với sứ mệnh ban đầu tập trung vào cung ứng nguyên vật liệu cơ bản cho thị trường." },
              { year: "2007", title: "Thành Lập Nam Việt", desc: "Chính thức ra mắt dưới tên gọi Công ty Nam Việt, thiết lập trụ sở và hệ thống quản trị chuyên nghiệp chuẩn mực." },
              { year: "2015", title: "Đạt Chuẩn Quốc Tế", desc: "Mở rộng liên kết nước ngoài. Thiết lập hệ thống cung ứng bao bì 50ml, 100ml... và nhận chứng chỉ danh giá." },
              { year: "2026", title: "Mở Rộng & Chuyển Đổi Số", desc: "Ứng dụng Hệ thống công nghệ cao, tự hào là điểm sáng hàng đầu của ngành Công nghiệp Dịch vụ Sản Xuất toàn quốc." },
            ].map((item, i) => (
              <div key={i} className="relative group">
                {/* Dấu chấm Timeline */}
                <div className="absolute -left-[43px] lg:-left-[75px] top-1.5 w-6 h-6 rounded-full bg-emerald-500 border-4 border-emerald-100 group-hover:scale-125 group-hover:border-emerald-200 transition-all z-20 shadow-sm"></div>
                
                {/* Năm - Nằm ẩn chìm */}
                <h4 className="text-5xl lg:text-6xl font-black text-emerald-50 group-hover:text-emerald-100 transition-colors absolute -top-12 lg:-top-16 left-0 select-none z-0 tracking-tighter">
                  {item.year}
                </h4>
                
                <div className="relative z-10 mt-2">
                  <div className="inline-block bg-emerald-100 px-3 py-1 rounded-lg text-emerald-700 font-black text-sm mb-3">Năm {item.year}</div>
                  <h5 className="text-2xl font-bold text-slate-800 mb-3">{item.title}</h5>
                  <p className="text-slate-600 font-medium leading-relaxed max-w-2xl text-lg">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
