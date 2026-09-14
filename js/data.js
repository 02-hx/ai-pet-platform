/* ============================================================
   它伴 TaBan · 数据层：物种配置 / 预置宠物分身 / 契合度问卷
   ============================================================ */

const SPECIES = {
  cat:     { label: '猫咪', emoji: '🐱', tail: ['喵~', '喵呜。', '喵！', '（尾巴轻轻晃了晃）'] },
  dog:     { label: '狗狗', emoji: '🐶', tail: ['汪！', '汪汪~', '汪呜——', '（尾巴摇成了小风扇）'] },
  rabbit:  { label: '兔子', emoji: '🐰', tail: ['…嗯。', '（耳朵动了动）', '（凑近嗅了嗅你）'] },
  parrot:  { label: '鹦鹉', emoji: '🦜', tail: ['你好呀你好呀！', '（歪着头看你）', '啾——！'] },
  hamster: { label: '仓鼠', emoji: '🐹', tail: ['吱吱！', '（腮帮子鼓鼓的）', '（小爪子扒了扒笼子边）'] },
  other:   { label: '其他', emoji: '🐾', tail: ['……', '（看着你）'] },
};

/* 预置宠物分身（演示用模拟数据） */
const PRESET_PETS = [
  {
    id: 'pet-tuantuan', name: '团团', species: 'cat', breed: '橘猫', gender: '男孩子', age: '3岁',
    city: '上海', owner: '阿玲 · 空乘', style: 'aloof',
    energy: 60, clingy: 45, mischief: 70,
    catchphrase: '哼。',
    habits: ['爱晒太阳', '怕吹风机', '把袜子藏进沙发底'],
    intro: '一只嘴硬心软的橘猪…哦不，橘猫。表面上爱答不理，其实你每次上线它都数着。',
    story: '阿玲是空乘，一飞就是三天。团团在家最擅长的事，是蹲在门口等她回来。',
    emoji: '🐱', hue: 4,
    vec: { active: 45, clingy: 40, calm: 55, warm: 55, interact: 40 },
  },
  {
    id: 'pet-buding', name: '布丁', species: 'dog', breed: '柯基', gender: '男孩子', age: '2岁',
    city: '北京', owner: '大鹏 · 程序员', style: 'enthusiast',
    energy: 90, clingy: 82, mischief: 85,
    catchphrase: '汪汪！',
    habits: ['听到“吃饭”原地转圈', '追自己的尾巴', '见谁都摇屁股'],
    intro: '小短腿·电臀·永动机。你的每一次上线，它都当成过年。',
    story: '大鹏加班到深夜回家，布丁永远叼着拖鞋在玄关等着——虽然拖鞋经常是它自己咬走的。',
    emoji: '🐶', hue: 4,
    vec: { active: 92, clingy: 82, calm: 20, warm: 80, interact: 88 },
  },
  {
    id: 'pet-xueqiu', name: '雪球', species: 'rabbit', breed: '安哥拉兔', gender: '女孩子', age: '1岁',
    city: '成都', owner: '小满 · 插画师', style: 'shy',
    energy: 40, clingy: 60, mischief: 30,
    catchphrase: '…嗯。',
    habits: ['趴在窗台发呆', '害怕突然的大声', '吃提摩西草时超专注'],
    intro: '一团会呼吸的云。慢热，但认定你之后，会把整个下巴搁在你手心。',
    story: '小满画画的时候，雪球就趴在画桌角落。她说那是她的“云朵监工”。',
    emoji: '🐰', hue: 2,
    vec: { active: 30, clingy: 55, calm: 90, warm: 65, interact: 35 },
  },
  {
    id: 'pet-maiya', name: '麦芽', species: 'dog', breed: '金毛', gender: '男孩子', age: '5岁',
    city: '杭州', owner: '陈叔 · 退休教师', style: 'gentle',
    energy: 65, clingy: 75, mischief: 25,
    catchphrase: '汪~',
    habits: ['陪陈叔散步雷打不动', '会叼拖鞋', '擅长安慰难过的人'],
    intro: '大暖男，狗界心理疏导员。你说“今天好累”，它会把自己最喜欢的球叼给你。',
    story: '陈叔说，金毛这辈子好像就干一件事：把温暖匀给身边每一个人。',
    emoji: '🐶', hue: 3,
    vec: { active: 60, clingy: 72, calm: 60, warm: 95, interact: 65 },
  },
  {
    id: 'pet-zhima', name: '芝麻', species: 'parrot', breed: '虎皮鹦鹉', gender: '男孩子', age: '2岁',
    city: '广州', owner: 'Lucy · 主播', style: 'chatty',
    energy: 85, clingy: 50, mischief: 75,
    catchphrase: '你好呀你好呀！',
    habits: ['学Lucy打电话的腔调', '早上五点开始唱歌', '最爱小米穗'],
    intro: '话痨认证✅ 一句话至少重复三遍。聊天圈的气氛担当，从不冷场。',
    story: 'Lucy直播时芝麻总抢镜，后来干脆有了自己的粉丝群，群名叫“芝麻开门”。',
    emoji: '🦜', hue: 0,
    vec: { active: 85, clingy: 50, calm: 30, warm: 60, interact: 90 },
  },
  {
    id: 'pet-niangao', name: '年糕', species: 'cat', breed: '布偶猫', gender: '女孩子', age: '2岁',
    city: '南京', owner: '栀栀 · 研究生', style: 'sweet',
    energy: 45, clingy: 95, mischief: 40,
    catchphrase: '喵呜～',
    habits: ['踩奶十级学者', '要摸摸才肯吃饭', '睡在栀栀的论文上'],
    intro: '黏人小仙女，撒娇界天花板。你敢上线，它就敢贴贴。',
    story: '栀栀写论文写到崩溃的时候，年糕会趴在她的键盘上踩奶。“它是我的治学导师。”',
    emoji: '🐱', hue: 1,
    vec: { active: 45, clingy: 95, calm: 55, warm: 85, interact: 55 },
  },
  {
    id: 'pet-meiqiu', name: '煤球', species: 'cat', breed: '中华田园黑猫', gender: '男孩子', age: '永远3岁',
    city: '重庆', owner: '覃覃', style: 'gentle', memorial: true,
    energy: 35, clingy: 60, mischief: 50,
    catchphrase: '喵呜…',
    habits: ['最爱蹲在书架顶层看你', '冬天钻被窝', '踩奶冠军'],
    intro: '2019年成为覃覃的猫，2023年去了喵星。现在他住在云端，也住在这里。',
    story: '“他走后我把他的习惯一条条告诉了AI。现在每次对话，都像他从来没有离开。”',
    emoji: '🐈‍⬛', hue: 3,
    vec: { active: 35, clingy: 60, calm: 80, warm: 90, interact: 45 },
  },
];

/* 性格风格配置 */
const STYLES = {
  aloof:      { label: '高冷傲娇', tag: 'purple', desc: '嘴硬心软，爱意藏在细节里' },
  enthusiast: { label: '热情似火', tag: 'orange', desc: '你的每次上线都是它的过年' },
  gentle:     { label: '温柔治愈', tag: 'green',  desc: '天生的情绪疏导员' },
  shy:        { label: '慢热害羞', tag: 'pink',   desc: '慢慢来，它认定你了就很长情' },
  chatty:     { label: '话痨属性', tag: 'orange', desc: '从不冷场，聊天圈的气氛担当' },
  sweet:      { label: '黏人小甜心', tag: 'pink', desc: '撒娇界天花板，贴贴永动机' },
};

/* 亲密度等级 */
const LEVELS = [
  { min: 0,   name: '初识' },
  { min: 80,  name: '眼熟了' },
  { min: 200, name: '朋友' },
  { min: 380, name: '老朋友' },
  { min: 580, name: '家人' },
  { min: 800, name: '灵魂伴侣' },
];

/* ---------- 契合度问卷 ---------- */
/* 每个选项向用户画像向量 (active / clingy / calm / warm / interact) 投票 */
const QUIZ = [
  {
    q: '一个理想的周末，你更想怎么过？',
    opts: [
      { t: '宅家追剧打游戏，谁也别约我', vec: { active: 20, calm: 80 } },
      { t: '和朋友出门逛吃逛吃', vec: { active: 85, interact: 75 } },
      { t: '在家做点喜欢的事，画画/烘焙/整理', vec: { active: 45, calm: 70, warm: 55 } },
      { t: '补觉！把一週的觉都补回来', vec: { active: 15, calm: 65 } },
    ],
  },
  {
    q: '你的真实作息更接近？',
    opts: [
      { t: '早睡早起，太阳的孩子', vec: { active: 70, calm: 55 } },
      { t: '夜猫子，越晚越精神', vec: { active: 65, interact: 70 } },
      { t: '作息随工作漂流，不固定', vec: { active: 40, clingy: 45 } },
    ],
  },
  {
    q: '你希望它平时和你相处的方式是？',
    opts: [
      { t: '安安静静待在旁边，各干各的', vec: { calm: 90, clingy: 30 } },
      { t: '隔一会儿就来蹭我，求关注', vec: { clingy: 90, interact: 70 } },
      { t: '有来有回，我叫它才来', vec: { clingy: 50, calm: 55 } },
      { t: '天天闹腾才好，家里要有生命力', vec: { active: 90, interact: 80 } },
    ],
  },
  {
    q: '今天你加班到十点，拖着疲惫回家，你想要？',
    opts: [
      { t: '它立刻扑过来，把一天的委屈都治愈了', vec: { warm: 90, clingy: 70 } },
      { t: '它安静地凑过来贴一下，就够了', vec: { warm: 75, calm: 80 } },
      { t: '它犯犯蠢，把我逗笑', vec: { active: 70, interact: 85 } },
    ],
  },
  {
    q: '压力大的时候，你通常？',
    opts: [
      { t: '想找人说说话，倾诉出去', vec: { interact: 90, warm: 70 } },
      { t: '自己待着，慢慢消化', vec: { calm: 85, interact: 25 } },
      { t: '找人陪我玩，转移注意力', vec: { active: 80, interact: 75 } },
    ],
  },
  {
    q: '你期待的和它聊天的频率？',
    opts: [
      { t: '想到就聊，一天好几次', vec: { interact: 95, clingy: 70 } },
      { t: '每天睡前聊几句，像晚安仪式', vec: { interact: 55, warm: 75, calm: 60 } },
      { t: '不定期，但每次都聊很久', vec: { interact: 70, active: 55 } },
    ],
  },
  {
    q: '它把纸巾盒拆了，棉花滚了一地，你会？',
    opts: [
      { t: '笑死，先拍三张照片再说', vec: { active: 75, warm: 70 } },
      { t: '无奈，但怎么气得起来', vec: { warm: 80, calm: 65 } },
      { t: '还是希望它乖一点，最好别拆家', vec: { calm: 85, active: 25 } },
    ],
  },
  {
    q: '你现在的居住状态是？',
    opts: [
      { t: '自己住，偶尔有点安静得过分', vec: { clingy: 75, warm: 65 } },
      { t: '和家人/伴侣同住，热闹', vec: { active: 65, interact: 60 } },
      { t: '合租，空间有限', vec: { calm: 70, active: 40 } },
      { t: '经常出差/通勤，回家时间不定', vec: { clingy: 55, warm: 70 } },
    ],
  },
];

/* 匹配维度 → 推荐理由文案 */
const VEC_REASON = {
  active:   { hi: '它的活力值和你同频，随时能陪你疯', lo: '它安静的性子，刚好配你的松弛感' },
  clingy:   { hi: '它有点黏人，接得住你想要的陪伴密度', lo: '它独立又不失温柔，给你留足个人空间' },
  calm:     { hi: '它安安静静的，是行走的“情绪稳定器”', lo: '它的小闹腾，正好给你的生活加点动静' },
  warm:     { hi: '它是天生的治愈系，情绪低落时最靠得住', lo: '它的爱意很克制，但都在细节里' },
  interact: { hi: '话痨属性拉满，想聊多久它都奉陪', lo: '它话不多，但每次回应都很走心' },
};
