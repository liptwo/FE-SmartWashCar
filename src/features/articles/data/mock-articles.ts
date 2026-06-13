export interface Article {
  id: string
  title: string
  slug: string
  summary: string
  content: string
  coverImage: string
  category: 'VEHICLE' | 'SERVICE'
  status: 'DRAFT' | 'PUBLISHED'
  author: string
  createdAt: string
  updatedAt: string
}

export const mockArticles: Article[] = [
  {
    id: 'art-1',
    title: '5 sai lầm tai hại khi tự rửa xe tại nhà làm trầy xước sơn',
    slug: '5-sai-lam-khi-tu-rua-xe-tai-nha',
    summary: 'Rửa xe tại nhà bằng nước rửa chén, dùng khăn lau bẩn hay rửa xe dưới trời nắng gắt là những sai lầm phổ biến khiến bề mặt sơn xe của bạn nhanh xuống cấp.',
    content: `
      <p>Tự chăm sóc xế yêu tại nhà là niềm vui của nhiều chủ xe. Tuy nhiên, nếu thực hiện sai phương pháp, bạn vô tình có thể tạo ra hàng ngàn vết xước xoáy (swirl marks) trên lớp sơn bóng của xe. Dưới đây là 5 sai lầm phổ biến nhất mà bạn cần tránh:</p>
      
      <h3>1. Sử dụng nước rửa chén hoặc bột giặt</h3>
      <p>Nước rửa chén và bột giặt có tính kiềm và tẩy rửa rất mạnh, được thiết kế để đánh tan dầu mỡ thực phẩm. Khi dùng cho xe hơi, chúng sẽ tẩy sạch lớp sáp bảo vệ sơn (wax) và làm khô lớp sơn bóng, khiến sơn xe nhanh bạc màu và mất đi độ bóng bẩy ban đầu. Hãy luôn sử dụng xà phòng chuyên dụng cho ô tô có pH cân bằng.</p>
      
      <h3>2. Chỉ sử dụng duy nhất một xô nước</h3>
      <p>Khi bạn dùng một xô duy nhất, bạn sẽ nhúng chiếc khăn bẩn chứa cát bụi trở lại xô và tiếp tục lau lên bề mặt sơn. Những hạt cát nhỏ này sẽ hoạt động như giấy nhám chà xát làm xước xe. Hãy áp dụng <strong>phương pháp 2 xô (Two-Bucket Method)</strong>: một xô chứa xà phòng sạch và một xô chứa nước sạch để xả khăn.</p>
      
      <h3>3. Lau xe bằng khăn khô thông thường hoặc quần áo cũ</h3>
      <p>Quần áo cũ hoặc khăn cotton thông thường không có khả năng giữ bụi bẩn tốt. Hãy đầu tư các loại <strong>khăn Microfiber siêu sợi</strong> chất lượng cao. Khăn này được thiết kế để giữ các hạt bụi sâu trong kẽ sợi, tránh cọ xát trực tiếp lên sơn xe.</p>
      
      <h3>4. Rửa xe trực tiếp dưới ánh nắng mặt trời</h3>
      <p>Nhiệt độ cao từ mặt trời làm nước và xà phòng khô rất nhanh trên bề mặt xe trước khi bạn kịp xả sạch. Điều này để lại các vết ố nước (water spots) rất khó xử lý trên sơn và kính xe.</p>
      
      <h3>5. Lau xe theo vòng tròn</h3>
      <p>Lau xe theo vòng tròn sẽ tạo ra các vết xước mạng nhện phản chiếu dưới ánh nắng rất mất thẩm mỹ. Thay vào đó, hãy lau dọc theo chiều gió chạy của xe (từ trước ra sau) để giảm thiểu tối đa hiện tượng xước dăm.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80&w=800',
    category: 'VEHICLE',
    status: 'PUBLISHED',
    author: 'Minh Tuấn (Chuyên gia Detailer)',
    createdAt: '2026-06-10T08:30:00Z',
    updatedAt: '2026-06-10T08:30:00Z',
  },
  {
    id: 'art-2',
    title: 'Tại sao phủ Ceramic lại là lựa chọn tối ưu bảo vệ sơn xe ô tô?',
    slug: 'loi-ich-cua-phu-ceramic-pro',
    summary: 'Tìm hiểu về công nghệ phủ Ceramic, sự khác biệt so với Wax thông thường và lý do vì sao dịch vụ này lại có giá trị bảo vệ lâu dài đến vậy.',
    content: `
      <p>Phủ Ceramic (phủ gốm) đang là một trong những giải pháp chăm sóc và bảo vệ sơn xe thịnh hành nhất hiện nay. Nhưng thực chất Ceramic hoạt động như thế nào và có đáng đồng tiền bát gạo?</p>
      
      <h3>Phủ Ceramic là gì?</h3>
      <p>Lớp phủ Ceramic là một loại polymer lỏng được bôi thủ công lên bên ngoài xe. Khi đông cứng, nó sẽ liên kết hóa học với lớp sơn bóng nguyên bản của xe, tạo thành một lớp bảo vệ bán vĩnh viễn không bị trôi đi khi rửa xe.</p>
      
      <h3>Các lợi ích vượt trội:</h3>
      <ul>
        <li><strong>Hiệu ứng lá sen (Hydrophobic):</strong> Bề mặt cực kỳ kỵ nước làm nước mưa và chất bẩn trượt đi dễ dàng, hạn chế tối đa các vết ố mưa và giúp việc rửa xe nhanh hơn gấp 2 lần.</li>
        <li><strong>Bảo vệ khỏi tia UV và Oxy hóa:</strong> Ngăn chặn tác hại của tia cực tím từ ánh nắng mặt trời khiến sơn xe bị phai màu hoặc bong tróc theo thời gian.</li>
        <li><strong>Tăng độ bóng sâu (Glossiness):</strong> Tạo ra hiệu ứng phản chiếu như gương gương, làm nổi bật màu sắc nguyên bản của xe.</li>
        <li><strong>Chống bám bẩn hóa học:</strong> Ngăn chặn các tác nhân có tính axit như phân chim, nhựa cây bám chặt và ăn mòn bề mặt sơn.</li>
      </ul>
      
      <p>Mặc dù chi phí ban đầu cao hơn so với phủ Wax hay Sealant thông thường, lớp phủ Ceramic có thể kéo dài từ 2 đến 5 năm nếu được bảo dưỡng đúng định kỳ, mang lại giá trị kinh tế lâu dài cho xế cưng của bạn.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800',
    category: 'SERVICE',
    status: 'PUBLISHED',
    author: 'Quốc Bảo (Trưởng bộ phận Kỹ thuật)',
    createdAt: '2026-06-12T10:15:00Z',
    updatedAt: '2026-06-12T10:15:00Z',
  },
  {
    id: 'art-3',
    title: 'Quy trình dọn nội thất chuyên sâu tại AutoWash Pro gồm những gì?',
    slug: 'quy-trinh-don-noi-that-chuyen-sau',
    summary: 'Một chiếc xe sạch sẽ không chỉ ở vẻ bề ngoài. Khám phá 8 bước dọn dẹp và diệt khuẩn khoang cabin đạt chuẩn detailing của chúng tôi.',
    content: `
      <p>Nhiều người chỉ chú trọng đến vỏ ngoài của xe mà quên đi rằng khoang nội thất mới là nơi chúng ta dành phần lớn thời gian tiếp xúc. Bụi bẩn, mồ hôi, thức ăn rơi vãi tích tụ lâu ngày trong môi trường kín là nơi trú ngụ lý tưởng của vi khuẩn gây hại cho sức khỏe hệ hô hấp.</p>
      
      <h3>Quy trình 8 bước tiêu chuẩn Detailing tại AutoWash Pro:</h3>
      <ol>
        <li><strong>Thu dọn đồ đạc cá nhân:</strong> Phân loại và gom gọn đồ dùng cá nhân của khách hàng vào túi riêng an toàn.</li>
        <li><strong>Hút bụi toàn diện:</strong> Hút sạch cát bụi ở các khe ghế, thảm lót sàn, trần xe và cốp sau.</li>
        <li><strong>Vệ sinh trần xe và các tấm ốp:</strong> Sử dụng dung dịch chuyên dụng pH nhẹ để làm sạch trần nỉ, tapi cửa và bảng điều khiển taplo mà không làm bay màu chất liệu.</li>
        <li><strong>Làm sạch sâu ghế ngồi:</strong> Sử dụng máy hút nước nóng hoặc bàn chải mềm vệ sinh sâu các vết ố trên ghế da/ghế nỉ.</li>
        <li><strong>Dưỡng da và nhựa:</strong> Thoa dung dịch bảo dưỡng giúp làm mềm da ghế, ngăn nứt nẻ và bảo vệ nhựa khỏi bị bạc màu do nắng chiếu.</li>
        <li><strong>Làm sạch kính trong suốt:</strong> Lau sạch kính bên trong cabin để đảm bảo tầm nhìn hoàn hảo nhất khi lái xe.</li>
        <li><strong>Xông tinh dầu khử mùi sinh học:</strong> Xử lý triệt để mùi hôi máy lạnh, mùi thuốc lá bằng công nghệ xông hơi tự nhiên.</li>
        <li><strong>Khử trùng bằng tia Ozone:</strong> Diệt sạch 99.9% vi khuẩn có hại bám trong các ngóc ngách hệ thống điều hòa gió.</li>
      </ol>
      <p>Hãy dọn nội thất chuyên sâu định kỳ mỗi 6 tháng một lần để giữ cho không gian cabin luôn thơm mát, trong lành và bảo vệ sức khỏe cho cả gia đình bạn!</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800',
    category: 'SERVICE',
    status: 'PUBLISHED',
    author: 'Khánh Duy (Detailer chuyên nghiệp)',
    createdAt: '2026-06-13T14:00:00Z',
    updatedAt: '2026-06-13T14:00:00Z',
  }
]
